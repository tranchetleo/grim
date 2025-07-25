const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // référence à l'utilisateur
    ref: 'User',
    required: true
  },
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
}, { _id: false }); // pas besoin d'un _id pour chaque note

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // référence au créateur du livre
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [ratingSchema], // tableau de notes
  averageRating: { type: Number, default: 0 } // note moyenne
});

module.exports = mongoose.model('Book', bookSchema);
