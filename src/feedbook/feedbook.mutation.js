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
  async updateFeedBook(_, { _id, comment, date }, { user }) {
    checkAuth(user)
    const toUpdate = user.feedBooks.id(_id)
    if (comment) toUpdate.comment = comment
    if (date) toUpdate.date = date
    await user.save()
    return toUpdate
  },
  async removeFeedBook(_, { _id }, { user }) {
    checkAuth(user)
    const toRemove = user.feedBooks.id(_id)
    toRemove.remove()
    await user.save()
    return toRemove
  },
}
