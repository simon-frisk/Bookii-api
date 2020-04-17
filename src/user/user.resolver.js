const { isBookIdTypeISBN, doesISBNBookIdsMatch } = require('../util/bookIdUtil')

module.exports = {
  async feedBooks(user, { bookId }) {
    return (isBookIdTypeISBN(bookId)
      ? user.feedBooks.filter((feedBook) =>
          doesISBNBookIdsMatch(feedBook.bookId, bookId)
        )
      : user.feedBooks
    ).sort(
      (a, b) => new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
    )
  },
}
