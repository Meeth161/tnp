const mongoose = require('mongoose');

var Company = mongoose.model('Company', {
  name: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = {Company};
