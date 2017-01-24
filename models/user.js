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

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser.save(callback);
    })
  })
}

module.exports.getUserByUsername = (username, callback) => {
  let query = { username: username };
  User.findOne(query, callback);
}

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
}

module.exports.comparePasswords = (candidatePassword, hash, callback) => {
   bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
     if (err) throw err;
     callback(null, isMatch);
   })
}