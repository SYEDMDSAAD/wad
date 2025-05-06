const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://mdsaadsyed29:CEfAFK57sHdjfE7a@cluster0.1nayux7.mongodb.net/books?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error: ', err));

// Define a book schema and model
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    genre: { type: String, required: true },
});

const Book = mongoose.model('Book', bookSchema);

// 1. Add a new book
app.post('/books', (req, res) => {
    const { title, author, price, genre } = req.body;

    const newBook = new Book({
        title,
        author,
        price,
        genre,
    });

    newBook.save()
        .then(book => res.status(201).json({ message: 'Book added', book }))
        .catch(err => res.status(500).json({ message: 'Error adding book', error: err }));
});

// 2. Retrieve a list of all books
app.get('/books', (req, res) => {
    Book.find()
        .then(books => res.json(books))
        .catch(err => res.status(500).json({ message: 'Error retrieving books', error: err }));
});

// 3. Update book details
app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, price, genre } = req.body;

    Book.findByIdAndUpdate(id, {
        title,
        author,
        price,
        genre,
    }, { new: true })
        .then(updatedBook => {
            if (!updatedBook) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json({ message: 'Book updated', updatedBook });
        })
        .catch(err => res.status(500).json({ message: 'Error updating book', error: err }));
});

// 4. Delete a book from the collection
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;

    Book.findByIdAndDelete(id)
        .then(deletedBook => {
            if (!deletedBook) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json({ message: 'Book deleted', deletedBook });
        })
        .catch(err => res.status(500).json({ message: 'Error deleting book', error: err }));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

