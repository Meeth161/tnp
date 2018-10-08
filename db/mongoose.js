const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://Meeth161:Meeth161@ds119072.mlab.com:19072/demo', { useNewUrlParser: true});

module.exports = {mongoose};
