const { Schema, model } = require('mongoose')
const FeedBook = require('./feedbook.model')

const User = new Schema({
  email: String,
  name: String,
  password: String,
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  feedBooks: [FeedBook],
  profilePicturePath: String,
})

module.exports = model('User', User)
