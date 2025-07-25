const Book = require('../models/book.model');

exports.getAllBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

exports.getBestRatedBooks = async (req, res) => {
  const books = await Book.find().sort({ averageRating: -1 }).limit(3);
  res.json(books);
};

exports.createBook = async (req, res) => {
  console.log('Creating book:', req);
  const book = new Book({ userId: req.body.userId, title: req.body.title, author: req.body.author, imageUrl: req.body.imageUrl, year: req.body.year, genre: req.body.genre });
  await book.save();
  res.status(201).json(book);
};

exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
  res.json(book);
};

exports.updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
};

exports.deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
