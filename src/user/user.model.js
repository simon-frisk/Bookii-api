const { Schema, model } = require('mongoose')

const FeedBook = new Schema({
  isbn: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
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
