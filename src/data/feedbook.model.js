const { Schema } = require('mongoose')

module.exports = new Schema({
  bookId: String,
  comment: String,
  date: String,
  favorite: Boolean,
})
