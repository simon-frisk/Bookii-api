const bookData = require('../data/book/bookData')
const Auth = require('../util/Auth')
const User = require('../data/user.model')

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
    async wikipediadescription(book) {
      const author = book.authors ? book.authors[0] : null
      return bookData.getWikipediaDescription(book.title, author)
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
