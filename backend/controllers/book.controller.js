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
  // Create a new book object
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`,
    averageRating: bookObject.ratings.length > 0 ? bookObject.ratings[0].grade : 0,
  });
  await book.save();
  res.status(201).json(book);
};

exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
  res.json(book);
};

exports.updateBook = async (req, res) => {
  console.log('Mise à jour du livre...');
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`,
  } : { ...req.body };

  delete bookObject._id;
  delete bookObject._userId;

  const book = await Book.findByIdAndUpdate(req.params.id, {
    ...bookObject,
    userId: req.auth.userId,
  }, { new: true });

  if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
  res.json(book);
};

exports.deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
