const pool = require('../db');


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

    return router;
};