const { Schema, model } = require('mongoose')

module.exports = new Schema({
  bookId: {
    type: String,
    required: true,
  },
  comment: String, //can be empty string
  date: {
    type: String,
    required: true,
  },
})
