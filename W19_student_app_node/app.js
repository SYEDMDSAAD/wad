const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://mdsaadsyed29:CEfAFK57sHdjfE7a@cluster0.1nayux7.mongodb.net/student?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB');
        insertSampleData(); // Insert only after DB is connected
    })
    .catch((err) => console.error('MongoDB connection error:', err));

// Schema
const studentSchema = new mongoose.Schema({
    Name: String,
    Roll_No: Number,
    WAD_Marks: Number,
    CC_Marks: Number,
    DSBDA_Marks: Number,
    CNS_Marks: Number,
    AI_marks: Number,
});

const Student = mongoose.model('studentmarks', studentSchema);

// Sample data
const sampleStudents = [
    { Name: 'ABC', Roll_No: 101, WAD_Marks: 25, CC_Marks: 26, DSBDA_Marks: 28, CNS_Marks: 27, AI_marks: 26 },
    { Name: 'DEF', Roll_No: 102, WAD_Marks: 15, CC_Marks: 20, DSBDA_Marks: 18, CNS_Marks: 30, AI_marks: 19 },
    { Name: 'XYZ', Roll_No: 103, WAD_Marks: 30, CC_Marks: 30, DSBDA_Marks: 30, CNS_Marks: 30, AI_marks: 30 },
    { Name: 'LMN', Roll_No: 104, WAD_Marks: 10, CC_Marks: 15, DSBDA_Marks: 12, CNS_Marks: 10, AI_marks: 18 }
];

async function insertSampleData() {
    const count = await Student.countDocuments({});
    if (count === 0) {
        await Student.insertMany(sampleStudents);
        console.log('Sample students inserted.');
    }
}

// a) Home route: Display all students in a table + count
app.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        const count = await Student.countDocuments();

        let html = `
            <h1>Total Students: ${count}</h1>
            <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                    <th>Name</th><th>Roll No</th><th>WAD</th><th>CC</th><th>DSBDA</th><th>CNS</th><th>AI</th>
                </tr>`;
        students.forEach(s => {
            html += `<tr>
                        <td>${s.Name}</td>
                        <td>${s.Roll_No}</td>
                        <td>${s.WAD_Marks}</td>
                        <td>${s.CC_Marks}</td>
                        <td>${s.DSBDA_Marks}</td>
                        <td>${s.CNS_Marks}</td>
                        <td>${s.AI_marks}</td>
                     </tr>`;
        });
        html += `</table>`;
        res.send(html);
    } catch (err) {
        res.status(500).send('Error fetching students');
    }
});

// b) DSBDA > 20
app.get('/dsbda-greater-than-20', async (req, res) => {
    const students = await Student.find({ DSBDA_Marks: { $gt: 20 } }, 'Name');
    res.send(students);
});

// c) Update marks of specified student by 10 (pass rollNo in JSON body)
app.put('/update-marks', async (req, res) => {
    const { rollNo } = req.body;
    await Student.updateOne({ Roll_No: rollNo }, {
        $inc: {
            WAD_Marks: 10,
            CC_Marks: 10,
            DSBDA_Marks: 10,
            CNS_Marks: 10,
            AI_marks: 10
        }
    });
    res.send(`Marks updated for Roll No: ${rollNo}`);
});

// d) Students with >25 marks in all subjects
app.get('/greater-than-25-all', async (req, res) => {
    const students = await Student.find({
        WAD_Marks: { $gt: 25 },
        CC_Marks: { $gt: 25 },
        DSBDA_Marks: { $gt: 25 },
        CNS_Marks: { $gt: 25 },
        AI_marks: { $gt: 25 },
    }, 'Name');
    res.send(students);
});

// e) Students with <40 in both maths (WAD+DSBDA) and science (CNS+AI)
app.get('/less-than-40-math-science', async (req, res) => {
    const students = await Student.find({
        WAD_Marks: { $lt: 40 },
        DSBDA_Marks: { $lt: 40 },
        CNS_Marks: { $lt: 40 },
        AI_marks: { $lt: 40 },
    }, 'Name');
    res.send(students);
});

// f) Remove a student (pass rollNo in body)
app.delete('/remove-student', async (req, res) => {
    const { rollNo } = req.body;
    await Student.deleteOne({ Roll_No: rollNo });
    res.send(`Student with Roll No ${rollNo} removed`);
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
