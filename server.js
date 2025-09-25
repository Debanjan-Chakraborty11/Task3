// server.js

// 1. Setup basic Express server
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());


// 4. Create an array to store book objects
// In-memory data store for books
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: '1984', author: 'George Orwell' }
];

// Simple auto-incrementing ID
let nextId = books.length + 1;
// ----------------------------------------

// --- CRUD Endpoints ---

// 5. Implement GET /books to return all books
app.get('/books', (req, res) => {
    // Return the entire books array
    res.status(200).json(books);
});

// 6. POST /books to add a new book from request body
app.post('/books', (req, res) => {
    // Get book data from the request body
    const { title, author } = req.body;

    // Basic validation
    if (!title || !author) {
        return res.status(400).json({ message: 'Missing title or author in request body.' });
    }

    // Create the new book object
    const newBook = {
        id: nextId++, // Assign and increment the ID
        title,
        author
    };

    // Add the new book to the in-memory array
    books.push(newBook);

    // Respond with the newly created book and status 201 (Created)
    res.status(201).json(newBook);
});

// 7. PUT /books/:id to update a book by ID
app.put('/books/:id', (req, res) => {
    // Get the book ID from the URL parameters (it comes as a string)
    const bookId = parseInt(req.params.id);
    const { title, author } = req.body;

    // Find the index of the book in the array
    const bookIndex = books.findIndex(b => b.id === bookId);

    // Handle case where book is not found
    if (bookIndex === -1) {
        return res.status(404).json({ message: `Book with ID ${bookId} not found.` });
    }

    // Get the existing book object
    const existingBook = books[bookIndex];

    // Create the updated book object, using existing values if new ones aren't provided
    const updatedBook = {
        ...existingBook, // Keep existing ID
        title: title !== undefined ? title : existingBook.title,
        author: author !== undefined ? author : existingBook.author
    };

    // Replace the old book object with the updated one
    books[bookIndex] = updatedBook;

    // Respond with the updated book
    res.status(200).json(updatedBook);
});

// 8. DELETE /books/:id to remove a book
app.delete('/books/:id', (req, res) => {
    // Get the book ID from the URL parameters
    const bookId = parseInt(req.params.id);

    // Find the index of the book in the array
    const bookIndex = books.findIndex(b => b.id === bookId);

    // Handle case where book is not found
    if (bookIndex === -1) {
        // Return 404 (Not Found)
        return res.status(404).json({ message: `Book with ID ${bookId} not found.` });
    }

    // Remove the book from the array (1 element at bookIndex)
    books.splice(bookIndex, 1);

    // Return 204 (No Content) for a successful deletion
    res.status(204).send();
});

// ----------------------------------------
// 3. Setup basic Express server on port 3000
app.listen(port, () => {
    console.log(`🚀 Book Management API running at http://localhost:${port}`);
    console.log('Test the endpoints with Postman!');
});