const express = require('express');
const Book = require('../models/book');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const books = await Book.find().populate('author');
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        const book = new Book(req.body);
        const result = await book.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
