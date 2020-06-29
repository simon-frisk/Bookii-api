const { Schema } = require('mongoose')
const { isBookId } = require('../util/bookIdUtil')

module.exports = new Schema({
  bookId: String,
  comment: String,
  date: String,
  favorite: Boolean,
})
