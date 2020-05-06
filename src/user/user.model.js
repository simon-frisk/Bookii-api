const { Schema, model } = require('mongoose')
const FeedBook = require('../feedbook/feedbook.model')
const {
  setName,
  validateName,
  validateEmail,
  validateEmailNotTaken,
  setPassword,
} = require('./user.util')

const User = new Schema({
  email: {
    type: String,
    required: [true, 'Email required'],
    validate: [
      {
        validator: validateEmailNotTaken,
        msg: 'Email is already taken',
      },
      { validator: validateEmail, msg: 'Email not valid' },
    ],
  },
  name: {
    type: String,
    required: [true, 'Name required'],
    set: setName,
    validate: [validateName, 'Name not valid'],
  },
  password: {
    type: String,
    required: true,
    set: setPassword,
    minlength: [6, 'Password has to be at least 6 characters'],
  },
  feedBooks: [FeedBook],
  profilePicturePath: {
    type: String,
    //TODO: validate profilePicturePath
  },
})

module.exports = model('User', User)
