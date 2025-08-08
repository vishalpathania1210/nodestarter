const mongoose = require('mongoose');

let UserSchema;
try {
  UserSchema = mongoose.model('Users');
} catch {
  UserSchema = mongoose.model('Users', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
  }));
}

module.exports = UserSchema;
