const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: String,
    dateOfBirth: Date,
    nationality: String,
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});

module.exports = mongoose.model('Author', authorSchema);
