const { Schema, model } = require('mongoose')

const FeedBook = new Schema({
  isbn10: String,
  isbn13: String,
  comment: String, //can be empty string
  date: {
    type: String,
    required: true,
  },
})

const User = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  feedBooks: [FeedBook],
})

module.exports = model('User', User)
