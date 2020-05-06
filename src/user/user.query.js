const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken-promisified')
const User = require('../user/user.model')
const { UserInputError } = require('apollo-server')
const checkAuth = require('../util/checkAuth')

module.exports = {
  async signin(_, { email, password }) {
    const user = await User.findOne({ email })
    if (!user) throw new UserInputError('Email or password not corrent')
    const correctPassword = await bcrypt.compare(password, user.password)
    if (!correctPassword)
      throw new UserInputError('Email or password not corrent')
    return jwt.signAsync({ userId: user._id }, process.env.JWT_SECRET)
  },
  async user(_, { userId: searchedUserId }, { user }) {
    checkAuth(user)
    try {
      if (searchedUserId) {
        const user = await User.findById(searchedUserId)
        return user
      }
    } catch (err) {
      return
    }
    return user
  },
  async users(_, __, { user }) {
    checkAuth(user)
    return User.find()
  },
}
