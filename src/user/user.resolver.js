const { isBookIdTypeISBN, doesISBNBookIdsMatch } = require('../book/bookIdUtil')

module.exports = {
  async feedBooks(user, { bookId, _id }) {
    let feedBooks = user.feedBooks
    if (_id) feedBooks = user.feedBooks.id(_id) ? [user.feedBooks.id(_id)] : []
    if (isBookIdTypeISBN(bookId))
      feedBooks = feedBooks
        .filter(feedBook => doesISBNBookIdsMatch(feedBook.bookId, bookId))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return feedBooks
  },
}
