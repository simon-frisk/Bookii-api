const { UserInputError } = require('apollo-server')
const mimeTypes = require('mime-types')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken-promisified')
const { BlobServiceClient } = require('@azure/storage-blob')
const User = require('../data/user.model')
const checkAuth = require('../util/checkAuth')
const { isBookIdTypeISBN, doesISBNBookIdsMatch } = require('../util/bookIdUtil')

module.exports = {
  Query: {
    async signin(_, { email, password }) {
      const user = await User.findOne({ email })
      if (!user) throw new UserInputError('Email or password not corrent')
      const correctPassword = await bcrypt.compare(password, user.password)
      if (!correctPassword)
        throw new UserInputError('Email or password not corrent')
      return jwt.signAsync({ _id: user._id }, process.env.JWT_SECRET)
    },
    async user(_, { _id: searchedId }, { user }) {
      checkAuth(user)
      if (searchedId) return User.findById(searchedId)
      return user
    },
    async users(_, __, { user: me }) {
      checkAuth(me)
      const users = await User.find()
      const usersNotMe = users.filter(
        user => user._id.toString() !== me._id.toString()
      )
      return usersNotMe
    },
  },
  Mutation: {
    async signup(_, { user: { email, name, password } }) {
      const { _id } = await new User({ email, name, password }).save()
      return jwt.signAsync({ _id }, process.env.JWT_SECRET)
    },
    async updateUser(
      _,
      { user: { email, password, name, profilePicture } },
      { user }
    ) {
      checkAuth(user)
      if (email) user.email = email
      if (password) user.password = password
      if (name) user.name = name
      if (profilePicture) {
        //TODO: check this code and delete old profilePic
        const file = await profilePicture
        const fileName = `profilePicture_${Date.now()}_${
          user._id
        }.${mimeTypes.extension(file.mimetype)}`
        const blobServiceClient = await BlobServiceClient.fromConnectionString(
          process.env.AZURE_STORAGE_CONNECTION_STRING
        )
        const containerClient = await blobServiceClient.getContainerClient(
          'profilepictures'
        )
        const blockBlobClient = containerClient.getBlockBlobClient(fileName)
        await blockBlobClient.uploadStream(file.createReadStream())
        const url = `https://bookistorage.blob.core.windows.net/profilepictures/${fileName}`
        user.profilePicturePath = url
      }
      await user.save()
      return user
    },
    async deleteUser(_, { _id }, { user }) {
      checkAuth(user)
      await User.findByIdAndDelete(_id)
      return user
    },
    async follow(_, { _id }, { user }) {
      checkAuth(user)
      //TODO: validate _id is an objectId (and do this in all other similar places too. Otherwise this will throw an internal server error instead of userinputerror)
      const followed = await User.findById(_id)
      if (!followed)
        throw new UserInputError('The user to follow does not exist')
      if (user.following.find(f => f.toString() === _id.toString()))
        return new UserInputError('The user to follow is already followed')
      user.following.push(_id)
      await user.save()
      followed.followers.push(user._id)
      await followed.save()
      return followed
    },
    async unfollow(_, { _id }, { user }) {
      checkAuth(user)
      const followed = await User.findById(_id)
      if (!followed)
        throw new UserInputError('The user to unfollow does not exist')
      const lengthBefore = user.following.length
      user.following = user.following.filter(
        f => f.toString() !== _id.toString()
      )
      if (lengthBefore === user.following.length)
        throw new UserInputError('The user to unfollow is not followed')
      await user.save()
      followed.followers = followed.followers.filter(
        f => f.toString() !== user._id.toString()
      )
      await followed.save()
      return followed
    },
  },
  User: {
    async feedBooks(user, { bookId, _id }) {
      let feedBooks = user.feedBooks
      if (_id)
        feedBooks = user.feedBooks.id(_id) ? [user.feedBooks.id(_id)] : []
      if (isBookIdTypeISBN(bookId))
        feedBooks = feedBooks.filter(feedBook =>
          doesISBNBookIdsMatch(feedBook.bookId, bookId)
        )
      feedBooks = feedBooks.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      return feedBooks
    },
    async following(user) {
      const populated = await user.populate('following').execPopulate()
      return populated.following
    },
    async followers(user) {
      const populated = await user.populate('followers').execPopulate()
      return populated.followers
    },
  },
}
