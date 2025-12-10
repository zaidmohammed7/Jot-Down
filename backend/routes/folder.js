const pool = require('../db');

module.exports = function (router) {
    // GET all folders
    const folderRoute = router.route('/folders');

    folderRoute.get(async (req, res) => {
        try {
            const result = await pool.query(
                `SELECT id, name, parent_folder 
                 FROM folders 
                 ORDER BY id`
            );
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });
const rootRoute = router.route('/folders/:folderId/root');

async function loadFolder(id, visited = new Set()) {
    if (visited.has(id)) return null;
    visited.add(id);

    // Load this folder
    const folderRes = await pool.query(
        `SELECT * FROM folders WHERE id = $1`, [id]
    );
    if (folderRes.rows.length === 0) return null;
    const folder = folderRes.rows[0];

    // Load children by parent pointer
    const subRes = await pool.query(
        `SELECT id FROM folders WHERE parent_folder = $1`,
        [id]
    );

    const subfolders = [];
    for (const row of subRes.rows) {
        const child = await loadFolder(row.id, visited);
        if (child) subfolders.push(child);
    }

    // Load documents (still using stored_documents array)
    const docs = [];
    if (Array.isArray(folder.stored_documents)) {
        for (const docId of folder.stored_documents) {
            const docRes = await pool.query(
                `SELECT * FROM documents WHERE id = $1`, [docId]
            );
            if (docRes.rows.length > 0) docs.push(docRes.rows[0]);
        }
    }

    return {
        id: folder.id,
        name: folder.name,
        parent_folder: folder.parent_folder,
        children: subfolders,
        documents: docs
    };
}

rootRoute.get(async (req, res) => {
    try {
        const tree = await loadFolder(req.params.folderId);
        res.json(tree);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error building folder tree");
    }
});

    // CREATE folder (optionally providing a parent folder)
    router.post('/folders', async (req, res) => {
        try {
            const { name, parent_folder } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Folder name required" });
            }

            const result = await pool.query(
                `INSERT INTO folders (name, parent_folder)
                 VALUES ($1, $2)
                 RETURNING id, name, parent_folder`,
                [name, parent_folder || null]
            );

            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

    // DELETE folder (does not auto-delete children)
    router.delete('/folders/:folderId', async (req, res) => {
        try {
            const { folderId } = req.params;

            // Optional: Check if folder has children
            const children = await pool.query(
                `SELECT id FROM folders WHERE parent_folder = $1`,
                [folderId]
            );

            if (children.rowCount > 0) {
                return res.status(400).json({
                    error: "Folder has subfolders. Delete or move them first."
                });
            }

            await pool.query(
                `DELETE FROM folders WHERE id = $1`,
                [folderId]
            );

            res.status(200).json({ message: "Folder deleted" });
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

    // RENAME folder
    router.put('/folders/:folderId/rename', async (req, res) => {
        try {
            const { folderId } = req.params;
            const { name } = req.body;

            const result = await pool.query(
                `UPDATE folders
                 SET name = $1
                 WHERE id = $2
                 RETURNING id, name, parent_folder`,
                [name, folderId]
            );

            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

    // MOVE folder (change parent_folder)
    router.put('/folders/:folderId/move', async (req, res) => {
        try {
            const { folderId } = req.params;
            const { newParentId } = req.body;

            // Prevent folder from being its own parent
            if (parseInt(folderId) === parseInt(newParentId)) {
                return res.status(400).json({ error: "Folder cannot be its own parent" });
            }

            // Validate parent exists (unless null)
            if (newParentId) {
                const parentCheck = await pool.query(
                    `SELECT id FROM folders WHERE id = $1`,
                    [newParentId]
                );

                if (parentCheck.rowCount === 0) {
                    return res.status(400).json({ error: "New parent folder not found" });
                }
            }

            // Update the folder's parent
            await pool.query(
                `UPDATE folders
                 SET parent_folder = $1
                 WHERE id = $2`,
                [newParentId || null, folderId]
            );

            res.json({ message: "Folder moved successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).send('Database error');
        }
    });

    return router;
};
