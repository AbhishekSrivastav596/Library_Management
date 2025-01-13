const express = require('express');
const User = require('../models/user');
const BorrowRecord = require('../models/borrowRecord');
const Book = require('../models/book');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, 
            role: 'user',
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET);

        res.json({ token, refreshToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id/borrow', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const book = await Book.findById(req.body.bookId);

        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.isBorrowed) return res.status(400).json({ message: 'Book is already borrowed' });

        const borrowRecord = new BorrowRecord({
            user: user._id,
            book: book._id,
            borrowedDate: new Date(),
        });
        await borrowRecord.save();

        book.isBorrowed = true;
        await book.save();

        res.json({ message: 'Book borrowed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id/return', verifyToken, async (req, res) => {
    try {
        const borrowRecord = await BorrowRecord.findOne({ user: req.user.id, book: req.body.bookId, returnedDate: null });

        if (!borrowRecord) return res.status(404).json({ message: 'No active borrow record found for this book' });

        borrowRecord.returnedDate = new Date();
        await borrowRecord.save();

        const book = await Book.findById(req.body.bookId);
        book.isBorrowed = false;
        await book.save();

        res.json({ message: 'Book returned successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
