const checkAuth = require('./util/checkAuth')

module.exports = {
  async feed(_, __, { user }) {
    checkAuth(user)
    await user.populate('following').execPopulate()
    const feedBooks = user.following.reduce(addUserFeedBooksToArray, [])
    feedBooks.push(...user.feedBooks)
    feedBooks.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return feedBooks
  },
}

function addUserFeedBooksToArray(array, user) {
  return [...array, ...user.feedBooks]
}
