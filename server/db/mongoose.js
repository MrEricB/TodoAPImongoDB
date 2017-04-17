var mongoose = require('mongoose');

//to use promises instead of callbacks with mongoos. choose the promise library to use
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/TodoApp');

module.exports = {
  mongoose: mongoose
};
