const { Schema, model } = require('mongoose')
const FeedBook = require('../feedbook/feedbook.model')

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
