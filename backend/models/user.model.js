const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // l’email doit être unique
  },
  password: {
    type: String,
    required: true, // on stocke ici le mot de passe **haché**
  }
});

module.exports = mongoose.model('User', userSchema);
