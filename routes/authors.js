const express = require('express');
const Author = require('../models/author');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const authors = await Author.find().populate('books');
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        const author = new Author(req.body);
        const result = await author.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id).populate('books');
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.json(author);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
