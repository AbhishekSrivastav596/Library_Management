const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    borrowedDate: { type: Date, default: Date.now },
    returnedDate: Date,
});

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
