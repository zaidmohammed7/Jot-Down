
  const express = require('express');
  const cors = require('cors');
  const app = express();
  const router = express.Router();
  const PORT = process.env.SERVER_PORT || 3500; // Use environment variable or default to 3500


  app.use(cors({
    origin: [
      'http://localhost:5173', 
      'http://localhost:3000', 
       'https://ryan-kumar.github.io/jot-down/'  // fill this in later
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, 
  }));
  app.use(express.json());

  

  app.get('/', (req, res) => {
    res.send('hello from the backend');
  });

  app.get('/api/gemini_key', (req, res) => {
    res.json({ key: process.env.GEMINI_KEY });
  });




  require('./routes')(app, router);
  // Start the server
  app.listen(PORT);
  console.log('Server running on port ' + PORT);