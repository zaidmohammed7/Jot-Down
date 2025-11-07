    const express = require('express');
    const cors = require('cors');
    const app = express();
    const PORT = process.env.PORT || 3500; // Use environment variable or default to 3500


    app.use(cors({
      origin: [
        'http://localhost:5173', 
        'http://localhost:3000', 
         process.env.LIVE_URL   // fill this in later
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true, 
    }));

    app.get('/', (req, res) => {
      res.send('hello from the backend');
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });