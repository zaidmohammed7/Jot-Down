const pool = require('../db');


module.exports = function(router) {
       const docRoute = router.route('/documents');

    // GET all documents
    docRoute.get(async (req, res) => {
        try {
            const result = await pool.query(`SELECT * FROM documents ORDER BY id`);
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

    router.get('/documents/:docId', async (req, res) => {
    try {
        const { docId } = req.params;

        const result = await pool.query(
            `SELECT * FROM documents WHERE id = $1`,
            [docId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Document not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
    });

    // CREATE document
    router.post('/documents', async (req, res) => {
        try {
            const { name, text, parent_folder } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Document name required" });
            }

            const result = await pool.query(
                `INSERT INTO documents (name, text, parent_folder)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [name, text || '', parent_folder || null]
            );

            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

    // DELETE document
    router.delete('/documents/:docId', async (req, res) => {
        try {
            const { docId } = req.params;

            await pool.query(
                `DELETE FROM documents WHERE id = $1`,
                [docId]
            );

            res.json({ message: "Document deleted" });
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

    // EDIT document (name OR text)
    router.put('/documents/:docId', async (req, res) => {
        try {
            const { docId } = req.params;
            const { name, text } = req.body;

            const result = await pool.query(
                `UPDATE documents
                 SET name = COALESCE($1, name),
                     text = COALESCE($2, text)
                 WHERE id = $3
                 RETURNING *`,
                [name, text, docId]
            );

            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

    // MOVE document to another folder
    router.put('/documents/:docId/move', async (req, res) => {
        try {
            const { docId } = req.params;
            const { newFolder } = req.body;

            await pool.query(
                `UPDATE documents
                 SET parent_folder = $1
                 WHERE id = $2`,
                [newFolder, docId]
            );

            res.json({ message: "Document moved" });
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

    return router;
};