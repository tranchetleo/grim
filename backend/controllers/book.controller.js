const Book = require('../models/book.model');
const fs = require('fs');
const path = require('path');

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

  const oldBook = await Book.findById(req.params.id);
  if (req.file && oldBook && oldBook.imageUrl) {
    const oldImage = oldBook.imageUrl.split('/images/')[1];
    if (oldImage) {
      fs.unlink(path.join('images', oldImage), err => {
        if (err) console.error('Erreur lors de la suppression de l\'ancienne image:', err);
      });
    }
  }

  const book = await Book.findByIdAndUpdate(req.params.id, {
    ...bookObject,
    userId: req.auth.userId,
  }, { new: true });

  if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
  res.json(book);
};

exports.deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book && book.imageUrl) {
    const imageName = book.imageUrl.split('/images/')[1];
    if (imageName) {
      fs.unlink(path.join('images', imageName), err => {
        if (err) console.error('Erreur lors de la suppression de l\'image :', err);
      });
    }
  }

  await Book.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

exports.addRating = async (req, res) => {
  const { id } = req.params;
  const { userId, rating } = req.body;

  // Check if the book exists
  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

  // Check if the user has already rated this book
  const existingRating = book.ratings.find(rating => rating.userId === userId);
  if (existingRating) {
    // If the user has already rated the book, update the rating
    existingRating.grade = rating;
  } else {
    // If the user has not rated the book yet, add a new rating
    book.ratings.push({
      userId,
      grade: rating
    });
  }

  const ratingCount = book.ratings.length;
  let ratingSum = 0;
  book.ratings.forEach(element => {
    ratingSum += element.grade;
  });

  // Calculate the new average rating
  if (ratingCount > 0) {
    book.averageRating = Number((ratingSum / ratingCount).toFixed(2));
  }

  await book.save();
  res.status(201).json(book);
};
