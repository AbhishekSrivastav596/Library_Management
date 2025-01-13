require('dotenv').config(); 
const express = require('express');

require('./mongoose_connection');

const booksRouter = require('./routes/books');
const authorsRouter = require('./routes/authors');
const usersRouter = require('./routes/users');
const borrowRecordsRouter = require('./routes/borrowRecords');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.use('/books', booksRouter);
app.use('/authors', authorsRouter);
app.use('/users', usersRouter);
app.use('/borrow-records', borrowRecordsRouter);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
