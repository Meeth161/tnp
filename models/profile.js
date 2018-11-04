const mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  domain: {
    type: String,
  },
  description: {
    type: String
  },
  role: {
    type: String
  }
});

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
      type: Date
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
      type: Number
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
    address: {
      type: String,
      trim: true
    }
  },
  education: {
    current: {
      course: {
        type: String
      },
      university: {
        type: String
      },
      institute: {
        type: String
      },
      startdate: {
        type: Date
      },
      enddate: {
        type: Date
      },
      score: {
        type: Number
      }
    },
    college: {
      course: {
        type: String
      },
      university: {
        type: String
      },
      institute: {
        type: String
      },
      startdate: {
        type: Date
      },
      enddate: {
        type: Date
      },
      score: {
        type: Number
      }
    },
    school: {
      course: {
        type: String
      },
      university: {
        type: String
      },
      institute: {
        type: String
      },
      startdate: {
        type: Date
      },
      enddate: {
        type: Date
      },
      score: {
        type: Number
      }
    }
  },
  projects: [projectSchema],
  activities: [String]
});

module.exports = {Profile};
