const mongoose = require('mongoose');

var Post = mongoose.model('Post', {
  title: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    default: 'Delivered'
  }
});

module.exports = {Post};
