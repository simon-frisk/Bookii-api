const checkAuth = require('../util/checkAuth')
const dbError = require('../util/dbError')

module.exports = {
  async addFeedBook(_, feedBook, { user }) {
    checkAuth(user)
    user.feedBooks.push(feedBook)
    try {
      await user.save()
    } catch (error) {
      dbError(error)
    }
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
