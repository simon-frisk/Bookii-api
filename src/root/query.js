const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken-promisified')
const User = require('../user/user.model')
const { AuthenticationError, UserInputError } = require('apollo-server')
const {
  getBookDataFromISBN,
  getBooksDataFromQuery,
} = require('../util/bookdata')
const { isBookIdTypeISBN } = require('../util/bookIdUtil')

module.exports = {
  async signin(_, { email, password }) {
    const user = await User.findOne({ email })
    if (!user) throw new UserInputError('Email or password not corrent')
    const correctPassword = await bcrypt.compare(password, user.password)
    if (!correctPassword)
      throw new UserInputError('Email or password not corrent')
    return jwt.signAsync({ userId: user._id }, process.env.JWT_SECRET)
  },
  async user(_, { userId: searchedUserId }, { userId }) {
    if (!userId) throw new AuthenticationError('Not authorized')
    return User.findById(searchedUserId || userId)
  },
  async book(_, { bookId }, userId) {
    if (!userId) throw new AuthenticationError('Not authorized')
    if (isBookIdTypeISBN(bookId)) return getBookDataFromISBN(bookId)
  },
  async bookQuery(_, { query }, userId) {
    if (!userId) throw new AuthenticationError('Not authorized')
    return getBooksDataFromQuery(query)
  },
}
