const express = require('express'); 
const mysql = require('mysql2'); 
const app = express(); 

 
// Create MySQL connection 
const connection = mysql.createConnection({ 
    host: 'localhost', 
    user: 'root', 
    password: 'RP738964$', 
    database: 'c237_studentListapp'
}); 
 
connection.connect((err) => { 
    if (err) { 
        console.error('Error connecting to MySQL:', err); 
        return; 
    }

    console.log('Connected to MySQL database');

  });
 
// Set up view engine 
app.set('view engine', 'ejs'); 
//  enable static files 
app.use(express.static('public')); 
//  enable from processing
app.use(express.urlencoded({
  extended: false
}));
 
// Define routes
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM students';
  // Fetch data from MySQL
  connection.query( sql , (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving studnets'); 
    }
   // Render HTML page with data
   res.render('index', { students: results });
  });
});

app.get('/student/:id', (req, res) => {
  // Extract the product ID from the request parameters
  const studentId = req.params.id;
  const sql = 'SELECT * FROM students WHERE studentId = ?';
  // Fetch data from MySQL based on the product ID
  connection.query( sql , [studentId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving product by ID'); 
    }
    // Check if any product with the given ID was found
    if (results.length > 0) {
      // Render HTML page with the product data
      res.render('student', { student: results[0] });
    } else {
      // If no product with the given ID was found
      res.send('student not found');
    }
  });
});


app.get('/addstudent', (req, res) => {
  res.render('addStudent');
});

app.post('/addStudent', (req, res) => {
  // Extract student data from the request body
  const { name, image, dob, contact } = req.body;
  const sql = 'INSERT INTO students (name, image, dob, contact) VALUES (?, ?, ?, ?)';
  // Insert the new student into the database
  connection.query(sql, [name, image, dob, contact], (error) => {
    if (error) {
      console.error('Error adding student:', error);
      return res.send('Error adding student');
    }

    res.redirect('/');
  });
});

app.get('/editStudent/:id', (req,res) => {
  const studentId = req.params.id;
  const sql = 'SELECT * FROM students WHERE studentId = ?';
  // Fetch data from MySQL based on the product ID
  connection.query( sql , [studentId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error retrieving student by ID'); 
    }
    // Check if any product with the given ID was found
    if (results.length > 0) {
      // Render HTML page with the product data
      res.render('editStudent', { student: results[0] });
    } else {
      // If no product with the given ID was found, render a 404 page or handle it accordingly
      res.send('Student not found');
    }
  });
});

app.post('/editStudent/:id', (req, res) => {
  const studentId = req.params.id;
  // Extract product data from the request body
  const { name, dob, contact } = req.body;
  console.log('recieve data',{studentId, name, dob, contact})
  const sql = 'UPDATE students SET name = ?, dob = ?, contact = ? WHERE studentId = ?';
  // Insert the new product into the database
  connection.query( sql , [name, dob, contact, studentId], (error, results) => {
    if (error) {
      // Handle any error that occurs during the database operation
      console.error("Error updating student:", error);
      res.send('Error updating student');
    } else {
      // Send a success response
      res.redirect('/');
    }
  });
});

app.get('/deleteStudent/:id', (req, res) => {
  const studentId = req.params.id;
  const sql = 'DELETE FROM students WHERE studentId = ?';
  connection.query( sql , [studentId], (error, results) => {
    if (error) {
      // Handle any error that occurs during the database operation
      console.error("Error deleting student:", error);
      res.send('Error deleting student');
    } else {
      // Send a success response
      res.redirect('/');
    }
  });
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));