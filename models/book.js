const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
    publishedDate: Date,
    genres: [String],
    price: { type: Number, min: 0 },
    isBorrowed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Book', bookSchema);
