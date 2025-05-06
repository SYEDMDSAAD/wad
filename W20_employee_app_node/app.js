const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB (replace <DB_URL> with your MongoDB URI)
mongoose.connect('mongodb+srv://mdsaadsyed29:CEfAFK57sHdjfE7a@cluster0.1nayux7.mongodb.net/employee?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error: ', err));

// Define the schema and model for employee
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  salary: { type: Number, required: true },
  joining_date: { type: Date, required: true },
});

const Employee = mongoose.model('Employee', employeeSchema);

// Routes

// 1. Add a new employee
// 1. Add a new employee
app.post('/add-employee', async (req, res) => {
  const { name, department, designation, salary, joining_date } = req.body;

  const newEmployee = new Employee({
    name,
    department,
    designation,
    salary,
    joining_date: new Date(joining_date),
  });

  try {
    const employee = await newEmployee.save();  // Using await to save the employee
    res.status(201).send(`Employee added: ${employee.name}`);
  } catch (err) {
    res.status(500).send('Error adding employee: ' + err.message); // Handling the error
  }
});


  /*{
  "name": "John Doe",
  "department": "Engineering",
  "designation": "Software Developer",
  "salary": 60000,
  "joining_date": "2023-05-01"
}
*/

// 2. View all employee records
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (err) {
    res.status(500).send('Error fetching employees: ' + err.message);
  }
});


// 3. Update an existing employee’s details
app.put('/update-employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, designation, salary, joining_date } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, department, designation, salary, joining_date: new Date(joining_date) },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).send('Employee not found');
    }

    res.send(`Employee updated: ${updatedEmployee.name}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating employee');
  }
});



// 4. Delete an employee record
// 4. Delete an employee record
app.delete('/delete-employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).send('Employee not found');
    }

    res.send(`Employee deleted: ${deletedEmployee.name}`);
  } catch (err) {
    res.status(500).send('Error deleting employee: ' + err.message);
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
