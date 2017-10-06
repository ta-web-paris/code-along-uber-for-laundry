const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isLaunderer: { type: Boolean, default: false },
  fee: { type: Number, default: null },
});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;
