const User = require('../user/user.model')
const jwt = require('jsonwebtoken-promisified')
const bcrypt = require('bcrypt')
const {
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require('apollo-server')
const checkAuth = require('../util/checkAuth')

module.exports = {
  async addFeedBook(_, { bookId, comment, date }, { user }) {
    checkAuth(user)
    if (!bookId) throw new UserInputError('Invalid bookId')
    if (comment === undefined || comment === null)
      throw new UserInputError('Invalid comment')
    if (!date) throw new UserInputError('Invalid date')
    const feedBook = {
      bookId,
      comment,
      date,
    }
    user.feedBooks.push(feedBook)
    await user.save()
    return feedBook
  },
  async removeFeedBook(_, { _id }, { user }) {
    checkAuth(user)
    const toRemove = user.feedBooks.find((feedBook) => feedBook._id == _id)
    const toRemoveIndex = user.feedBooks.indexOf(toRemove)
    user.feedBooks.splice(toRemoveIndex, 1)
    await user.save()
    return toRemove
  },
  async signup(_, { user }) {
    await validateUser(user)
    const password = await bcrypt.hash(user.password, 10)
    const { id } = await User.create({ ...user, password })
    return jwt.signAsync({ userId: id }, process.env.JWT_SECRET)
  },
}

const validateUser = async (user) => {
  if (!emailRegex.test(user.email)) throw new UserInputError('Not valid email')
  if (!nameRegex.test(user.name)) throw new UserInputError('Not valid name')
  if (!passwordRegex.test(user.password))
    throw new UserInputError('Password too short')
  if (await User.findOne({ email: user.email }))
    throw new UserInputError('Email already in use')
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const nameRegex = /^[A-ZÅÄÖ][a-zaåä]+ [A-ZÅÄÖ][a-zåäö]+$/
const passwordRegex = /^.{6,}$/
