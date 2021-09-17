const db = require('./db/connection');
const express = require('express');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3306;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

      app.get('/', (req, res) => {
        res.json({
          message: 'Hello World'
        });
      });

// Not Found response for unmatched routes
app.use((req, res) => {
    res.status(404).end();
  });
  
  db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });