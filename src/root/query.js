const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken-promisified')
const User = require('../user/user.model')
const { AuthenticationError, UserInputError } = require('apollo-server')
const {
  getBookDataFromBookId,
  getBooksDataFromQuery,
} = require('../util/bookdata')
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
    if (searchedUserId) return User.findById(searchedUserId)
    else return user
  },
  async book(_, { bookId }, { user }) {
    checkAuth(user)
    return getBookDataFromBookId(bookId)
  },
  async bookQuery(_, { query }, { user }) {
    checkAuth(user)
    return getBooksDataFromQuery(query)
  },
}
