const checkAuth = require('../util/checkAuth')
const bookData = require('../data/book/bookData')
const { isBookId } = require('../util/bookIdUtil')
const { UserInputError } = require('apollo-server')

module.exports = {
  Mutation: {
    async addFeedBook(_, { date, comment, bookId }, { user }) {
      checkAuth(user)
      if (!date) throw new UserInputError('Date required')
      if (!isBookId(bookId)) throw new UserInputError('BookId not valid')
      user.feedBooks.push({ date, comment, bookId })
      await user.save()
      return user.feedBooks[user.feedBooks.length - 1]
    },
    async updateFeedBook(_, { _id, comment, date }, { user }) {
      checkAuth(user)
      const toUpdate = user.feedBooks.id(_id)
      if (comment) toUpdate.comment = comment
      if (date) {
        if (!date) throw new UserInputError('Date required')
        toUpdate.date = date
      }
      await user.save()
      return toUpdate
    },
    async removeFeedBook(_, { _id }, { user }) {
      checkAuth(user)
      const toRemove = user.feedBooks.id(_id)
      toRemove.remove()
      user.favoriteBooks.remove(_id)
      await user.save()
      return toRemove
    },
  },
  FeedBook: {
    async book(feedBook) {
      return bookData.getByBookId(feedBook.bookId)
    },
    async user(feedBook) {
      return feedBook.parent()
    },
  },
}
