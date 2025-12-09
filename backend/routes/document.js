const pool = require('../db');


module.exports = function(router) {
    var docRoute = router.route('/documents');
    

    docRoute.get(async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM documents');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

   

    

    return router;
};