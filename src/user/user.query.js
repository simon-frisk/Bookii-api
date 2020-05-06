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
    return jwt.signAsync({ _id: user._id }, process.env.JWT_SECRET)
  },
  async user(_, { _id: searchedId }, { user }) {
    checkAuth(user)
    try {
      if (searchedId) {
        const user = await User.findById(searchedId)
        return user
      }
    } catch (err) {
      return
    }
    return user
  },
  async users(_, __, { user: me }) {
    checkAuth(me)
    const users = await User.find()
    return users.filter(user => user._id.toString() !== me._id.toString())
  },
}
