const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API route to get user data
app.get('/api/users', (req, res) => {
  fs.readFile('./data/users.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading user data');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
