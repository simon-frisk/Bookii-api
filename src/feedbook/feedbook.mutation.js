const checkAuth = require('../util/checkAuth')

module.exports = {
  async addFeedBook(_, feedBook, { user }) {
    checkAuth(user)
    user.feedBooks.push(feedBook)
    await user.save()
    return user.feedBooks[user.feedBooks.length - 1]
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
    user.save()
    return toRemove
  },
}
