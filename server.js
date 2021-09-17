const mysql = require('mysql2');
const express = require('express');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3002;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Man0fcode21!',
      database: 'company'
    },
    console.log('Connected to the company database.')
  );

      app.get('/', (req, res) => {
        res.json({
          message: 'Hello World'
        });
      });

// Not Found response for unmatched routes
app.use((req, res) => {
    res.status(404).end();
  });
  
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });