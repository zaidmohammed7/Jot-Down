    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

    // Define a basic route
    app.get('/', (req, res) => {
      res.send('this is my test');
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });