const pool = require('../db');
const crypto = require("crypto");


module.exports = function(router) {
    var userRoute = router.route('/users');
    

    userRoute.get(async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM users');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

    userRoute.post(async (req, res) => {
        try {
            const { name, email } = req.body;

            if (!name || !email) {
                return res.status(400).json({ error: 'Name and email are required.' });
            }

            const result = await pool.query(
                'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
                [name, email]
            );

            res.status(201).json({
            message: 'User added successfully',
            user: result.rows[0],
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    });

    var userSignupRoute = router.route('/users/signup');

    userSignupRoute.post(async (req, res) => {
         try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Invalid name/password/email' });
            }

            console.log('This is the name : %s', name);
            console.log('This is the email : %s', email);
            console.log('this is the password :%s', password);
            
            const userResult = await pool.query(
            `SELECT id, password_hash_with_salt, salt FROM users WHERE email = $1`,
            [email]
            );

            if (userResult.rowCount != 0) {
                return res.status(401).json({ error: "User associated with this email already exists" });
            }

            
            const salt = crypto.randomBytes(16).toString("hex");
            const passwordHash = crypto.createHash("sha256")
                .update(password + salt)
                .digest("hex");

            const insertResult = await pool.query(
                `INSERT INTO users (email, name, password_hash_with_salt, salt)
                VALUES ($1, $2, $3, $4)
                RETURNING id`,
                [email, name, passwordHash, salt]
            );
                    
            res.status(200).json({
                message: 'Successful Account creation',
                userID: insertResult.rows[0].id
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }

    });

    var userLoginRoute = router.route('/users/login');

    userLoginRoute.post(async (req, res) => {
         try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Invalid password/email' });
            }

            console.log('This is the email : %s', email);
            console.log('this is the password :%s', password);
            
            const userResult = await pool.query(
            `SELECT id, password_hash_with_salt, salt FROM users WHERE email = $1`,
            [email]
            );

            if (userResult.rowCount === 0) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const user = userResult.rows[0];

            const computedHash = crypto
                .createHash("sha256")
                .update(password + user.salt)
                .digest("hex");

            const hashesMatch = crypto.timingSafeEqual(
            Buffer.from(computedHash, "utf8"),
            Buffer.from(user.password_hash_with_salt, "utf8")
            );

            if (!hashesMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
                    
            res.status(200).json({message: 'Successful Login', userID: user.id});
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }

    });

    return router;
};