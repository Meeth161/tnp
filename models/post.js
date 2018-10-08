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
  }
});

module.exports = {Post};
