const { UserInputError } = require('apollo-server')
const mimeTypes = require('mime-types')
const bcrypt = require('bcrypt')
const { Storage } = require('@google-cloud/storage')
const User = require('../data/user.model')
const userUtil = require('../util/userUtil')
const bookData = require('../data/book/bookData')
const Auth = require('../util/Auth')
const emailService = require('../services/emailService')

const storage = new Storage()

module.exports = {
  Query: {
    async signin(_, { email, password }) {
      const user = await User.findOne({ email })
      if (!user) throw new UserInputError('Email or password not corrent')
      const correctPassword = await bcrypt.compare(password, user.password)
      if (!correctPassword)
        throw new UserInputError('Email or password not corrent')
      return userUtil.signJWT(user._id)
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
    async forgotpassword(_, { email }) {
      const user = await User.findOne({ email })
      if (!user) throw new UserInputError('No user with that email')

      const password =
        Math.floor(Math.random() * 9000000000000000) + 1000000000000000
      const hash = await userUtil.validatePasswordAndCreateHash(
        password.toString()
      )
      user.password = hash
      await user.save()

      await emailService.sendMail({
        to: user.email,
        subject: 'Forgot password',
        text: `Your password has been updated and the new password is ${password}`,
      })
      return true
    },
    async userSearch(_, { name }, ctx) {
      await Auth.checkSignInAndConsentAndReturn(ctx.decodedToken._id)
      const users = await User.find({ $text: { $search: name } })
      return users
    },
  },
  Mutation: {
    async signup(_, { user: { email, name, password, latestConsent } }) {
      if (latestConsent !== true)
        throw new UserInputError('You have to agree to policies to sign up')
      const fixedEmail = await userUtil.validateAndFixEmail(email)
      const fixedName = userUtil.validateAndFixName(name)
      const hash = await userUtil.validatePasswordAndCreateHash(password)
      const user = await new User({
        email: fixedEmail,
        name: fixedName,
        password: hash,
        latestConsent,
      })
      await user.save()
      return userUtil.signJWT(user._id)
    },
    async updateUser(
      __,
      { user: { email, password, name, profilePicture } },
      ctx
    ) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      if (email)
        user.email = await userUtil.validateAndFixEmail(email, user._id)
      if (name) user.name = userUtil.validateAndFixName(name)
      if (password)
        user.password = await userUtil.validatePasswordAndCreateHash(password)
      if (profilePicture) {
        const file = await profilePicture
        const bucket = storage.bucket('bookapp-282214.appspot.com')

        if (user.profilePicturePath) {
          try {
            const array = user.profilePicturePath.split('/')
            const prevFileName = array.slice(array.length - 2).join('/')
            await bucket.file(prevFileName).delete()
          } catch (e) {}
        }

        const fileName = `profile_pictures/profilePicture_${Date.now()}_${
          user._id
        }.${mimeTypes.extension(file.mimetype)}`

        await new Promise(resolve => {
          file
            .createReadStream()
            .pipe(
              bucket.file(fileName).createWriteStream({
                resumable: false,
                gzip: true,
              })
            )
            .on('finish', resolve)
        })

        user.profilePicturePath =
          'https://storage.googleapis.com/bookapp-282214.appspot.com/' +
          fileName
      }
      await user.save()
      return user
    },
    async deleteUser(_, __, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      await User.findByIdAndDelete(user._id)
      //TODO: delete from following, followers, flags etc.
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
