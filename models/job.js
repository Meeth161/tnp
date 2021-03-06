const mongoose = require('mongoose');

var Job = mongoose.model('Job', {
  title: {
    type: String,
    required: true,
    trim: true
  },
  comapany: {
    type: String,
    required: true
  },
  ctc: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  location: {
    type: [String]
  },
  description: {
    type: String
  },
  status: {
    type: String,
    required: true,
    default: 'closed'
  }
});

module.exports = {Job};
