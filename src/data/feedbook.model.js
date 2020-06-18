const { Schema } = require('mongoose')
const { isBookId } = require('../util/bookIdUtil')

module.exports = new Schema({
  bookId: {
    type: String,
    required: [true, 'BookId required'],
    validate: [isBookId, 'BookId not valid'],
  },
  comment: {
    type: String,
    validate: [
      comment => {
        if (comment === undefined || comment === null) return false
      },
      'Comment can be empty but not undefined',
    ],
  },
  date: {
    type: String,
    required: [true, 'Date required'],
    //TODO: validate to check that is date
  },
})
