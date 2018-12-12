const mongoose = require('mongoose');

var Profile = mongoose.model('Profile', {
  about: {
    name: {
      firstName: {
        type: String,
        trim: true
      },
      middleName: {
        type: String,
        trim: true
      },
      lastName: {
        type: String,
        trim: true
      }
    },
    gender: {
      type: String,
      trim: true
    },
    dob: {
      type: String
    },
    usn: {
      type: String,
      unique: true,
      trim: true
    },
    branch: {
      type: String,
      trim: true
    },
    sem: {
      type: Number,
      default: 7
    },
    contact: {
      email: {
        type: String,
        unique: true,
        trim: true
      },
      phone: {
        type: Number,
        minlength: 10,
        maxlength: 10
      }
    },
  },
  education: {
    be: {
      type: Number
    },
    college: {
      type: Number
    },
    school: {
      type: Number
    },
    status: {
      type: String,
      default: 'not verified'
    }
  }
});

module.exports = {Profile};
