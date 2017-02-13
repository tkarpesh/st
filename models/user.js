let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  }
});

let User = mongoose.model('User', UserSchema);
