const bookData = require('../data/book/bookData')
const Auth = require('../util/Auth')
const User = require('../data/user.model')
const categories = require('../data/categories')
const Wikipedia = require('../data/Wikipedia')

module.exports = {
  Query: {
    async book(_, { bookId }, ctx) {
      await Auth.checkSignInAndConsentAndReturn(ctx.decodedToken._id)
      return bookData.getByBookId(bookId)
    },
    async bookSearch(_, { query }, ctx) {
      await Auth.checkSignInAndConsentAndReturn(ctx.decodedToken._id)
      return bookData.getByQuery(query)
    },
  },
  Book: {
    async categories(book) {
      if (!book.categories) return null
      const bookCategories = []
      categories.forEach(category => {
        if (book.categories.includes(category.name))
          bookCategories.push(category)
      })
      return bookCategories
    },
    async wikipediadescription(book) {
      return Wikipedia.getExtract(book.title, book.authors)
    },
    async youtubevideos(book) {
      return bookData.getYoutubeVidoes(book.title)
    },
    async onselffeed(book, _, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      return user.feedBooks
        .filter(feedBook => feedBook.bookId === book.bookId)
        .sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
    },
    async onfollowingfeed(book, _, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      await user.populate('following').execPopulate()
      return user.following
        .reduce((feedBooks, following) => {
          return following.feedBooks
            .filter(feedBook => feedBook.bookId === book.bookId)
            .concat(feedBooks)
        }, [])
        .sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
    },
    async isWished(book, _, ctx) {
      const user = await User.findById(ctx.decodedToken._id)
      if (user.wishBooks.includes(book.bookId)) return true
      else return false
    },
  },
}
