const { UserInputError } = require('apollo-server')
const mimeTypes = require('mime-types')
const bcrypt = require('bcrypt')
const { BlobServiceClient } = require('@azure/storage-blob')
const User = require('../data/user.model')
const userService = require('../services/userService')
const bookData = require('../data/book/bookData')
const Auth = require('../util/Auth')

module.exports = {
  Query: {
    async signin(_, { email, password }) {
      const user = await User.findOne({ email })
      if (!user) throw new UserInputError('Email or password not corrent')
      const correctPassword = await bcrypt.compare(password, user.password)
      if (!correctPassword)
        throw new UserInputError('Email or password not corrent')
      return userService.signJWT(user._id)
    },
    async user(_, { _id: searchedId }, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      if (searchedId) return User.findById(searchedId)
      return user
    },
    async users(_, __, ctx) {
      const self = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      const users = await User.find()
      const usersNotSelf = users.filter(
        user => user._id.toString() !== self._id.toString()
      )
      return usersNotSelf
    },
  },
  Mutation: {
    async signup(_, { user: { email, name, password } }) {
      const fixedEmail = await userService.validateAndFixEmail(email)
      const fixedName = userService.validateAndFixName(name)
      const hash = await userService.validatePasswordAndCreateHash(password)
      const user = await new User({
        email: fixedEmail,
        name: fixedName,
        password: hash,
      })
      await user.save()
      return userService.signJWT(user._id)
    },
    async updateUser(
      _,
      { user: { email, password, name, profilePicture } },
      ctx
    ) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      if (email)
        user.email = await userService.validateAndFixEmail(email, user._id)
      if (name) user.name = userService.validateAndFixName(name)
      if (password)
        user.password = await userService.validatePasswordAndCreateHash(
          password
        )

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
    async deleteUser(_, __, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      await User.findByIdAndDelete(user._id)
      return user
    },
    async follow(_, { _id }, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
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
    async unfollow(_, { _id }, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
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
    async toggleinappropriateflagged(_, { _id }, ctx) {
      const self = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      const user = await User.findById(_id)
      if (!user) throw new UserInputError('User does not exist')
      if (user._id.toString() === self._id.toString())
        throw new UserInputError("You can't flag yourself")
      if (user.inappropriateFlags.includes(self._id)) {
        const index = user.inappropriateFlags.indexOf(self._id)
        user.inappropriateFlags.splice(index, 1)
        await user.save()
        return false
      } else {
        user.inappropriateFlags.push(self._id)
        await user.save()
        return true
      }
    },
    async acceptLatestPolicies(_, __, ctx) {
      const user = await Auth.checkSignInAndReturn(ctx.decodedToken._id)
      user.latestConsent = true
      await user.save()
      return true
    },
  },
  User: {
    async feedBooks(user, { _id }) {
      let feedBooks = user.feedBooks
      if (_id)
        feedBooks = user.feedBooks.id(_id) ? [user.feedBooks.id(_id)] : []
      feedBooks = feedBooks.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      return feedBooks
    },
    async wishBooks(user) {
      return Promise.all(
        user.wishBooks.map(async id => {
          return bookData.getByBookId(id)
        })
      )
    },
    async following(user) {
      const populated = await user.populate('following').execPopulate()
      return populated.following
    },
    async followers(user) {
      const populated = await user.populate('followers').execPopulate()
      return populated.followers
    },
    async isinappropriateflagged(user, _, ctx) {
      if (user.inappropriateFlags.includes(ctx.decodedToken._id)) return true
      return false
    },
  },
}
