
  const express = require('express');
  const cors = require('cors');
  const app = express();
  const pool = require('./db');
  const PORT = process.env.SERVER_PORT || 3500; // Use environment variable or default to 3500


  app.use(cors({
    origin: [
      'http://localhost:5173', 
      'http://localhost:3000', 
        process.env.LIVE_URL   // fill this in later
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, 
  }));
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('hello from the backend');
  });


  app.get('/users', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Database error');
    }
  });

  app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    // quick check to make sure fields exist
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



  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }); 