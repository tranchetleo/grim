const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Use memory storage so the original file is not saved to disk
const storage = multer.memoryStorage();

module.exports = multer({ storage: storage }).single('image');

module.exports.resizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const extension = MIME_TYPES[req.file.mimetype];
  const name = req.file.originalname.replace(/[\s.]+/g, '_');
  const fileName = name + Date.now() + '.' + extension;
  const outputFilePath = path.join('images', `resized_${fileName}`);

  sharp(req.file.buffer)
    .resize({ width: 206, height: 260 })
    .toFile(outputFilePath)
    .then(() => {
      req.file.path = outputFilePath;
      req.file.filename = `resized_${fileName}`;
      next();
    })
    .catch(err => {
      console.log(err);
      return next();
    });
};
