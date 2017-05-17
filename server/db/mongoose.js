var mongoose = require('mongoose');

//to use promises instead of callbacks with mongoos. choose the promise library to use
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose: mongoose
};
