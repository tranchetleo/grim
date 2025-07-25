const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');

const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

// MongoDB connection
mongoose.connect('mongodb+srv://leotranchetpro:' + process.env.DB_PASSWORD + '@cluster0.lxtdidt.mongodb.net/',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app;


// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);