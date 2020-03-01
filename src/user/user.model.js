const { Schema, model } = require('mongoose')

const ReadBook = new Schema({
  isbn: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})

const User = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  readBooks: [ReadBook]
})

module.exports = model('User', User)
