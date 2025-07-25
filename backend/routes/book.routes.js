const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const auth = require('../middleware/auth');

// GET tous les livres
router.get('/', bookController.getAllBooks);

// GET les meilleurs notés
router.get('/bestrating', bookController.getBestRatedBooks);

// POST un nouveau livre
router.post('/', auth, bookController.createBook);

// GET un livre par ID
router.get('/:id', bookController.getBookById);

// PUT modifier un livre
router.put('/:id', auth, bookController.updateBook);

// DELETE un livre
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
