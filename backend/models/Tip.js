const mongoose = require('mongoose');

const TipSchema = new mongoose.Schema({
  message: { type: String, required: true }
});

module.exports = mongoose.model('Tip', TipSchema);
