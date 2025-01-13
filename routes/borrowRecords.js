const express = require('express');
const BorrowRecord = require('../models/borrowRecord');
const Book = require('../models/book');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        const records = await BorrowRecord.find()
            .populate('user')
            .populate('book');
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
