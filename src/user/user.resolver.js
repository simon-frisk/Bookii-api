const { isBookIdTypeISBN, doesISBNBookIdsMatch } = require('../book/bookIdUtil')

module.exports = {
  async feedBooks(user, { bookId }) {
    return (isBookIdTypeISBN(bookId)
      ? user.feedBooks.filter((feedBook) =>
          doesISBNBookIdsMatch(feedBook.bookId, bookId)
        )
      : user.feedBooks
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
}
