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
  profilePicturePath: {
    type: String,
    get: (profilePictureName) =>
      `https://bookistorage.blob.core.windows.net/profilepictures/${profilePictureName}`,
    set: (profilePicturePath) =>
      profilePicturePath.replace(
        'https://bookistorage.blob.core.windows.net/profilepictures/',
        ''
      ),
  },
})

module.exports = model('User', User)
