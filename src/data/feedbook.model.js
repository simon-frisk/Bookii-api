const { Schema } = require('mongoose')

module.exports = new Schema({
  bookId: String,
  comment: String,
  date: String,
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      comment: String,
    },
  ],
  favorite: Boolean,
})
