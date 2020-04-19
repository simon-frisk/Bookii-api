const { UserInputError } = require('apollo-server')
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
}
