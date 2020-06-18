const { isBookIdTypeISBN, doesISBNBookIdsMatch } = require('../util/bookIdUtil')

module.exports = {
  User: {
    async feedBooks(user, { bookId, _id }) {
      let feedBooks = user.feedBooks
      if (_id)
        feedBooks = user.feedBooks.id(_id) ? [user.feedBooks.id(_id)] : []
      if (isBookIdTypeISBN(bookId))
        feedBooks = feedBooks.filter(feedBook =>
          doesISBNBookIdsMatch(feedBook.bookId, bookId)
        )
      feedBooks = feedBooks.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      return feedBooks
    },
    async following(user) {
      const populated = await user.populate('following').execPopulate()
      return populated.following
    },
    async followers(user) {
      const populated = await user.populate('followers').execPopulate()
      return populated.followers
    },
  },
}
