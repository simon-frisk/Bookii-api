const bookData = require('../data/book/bookData')
const _ = require('lodash')
const Auth = require('../util/Auth')

module.exports = {
  Query: {
    async bookLists(_, { name }, ctx) {
      await Auth.checkSignInAndConsentAndReturn(ctx.decodedToken._id)
      if (name) return bookData.getNYTBestSellerList(name)
      else return bookData.getNYTBestSellerLists()
    },
  },
  BookList: {
    async books({ books: bookIds }) {
      const books = await Promise.all(
        bookIds.map(async bookId => {
          try {
            return await bookData.getByBookId(bookId)
          } catch (error) {}
        })
      )
      return books.filter(book => !_.isUndefined(book))
    },
  },
}
