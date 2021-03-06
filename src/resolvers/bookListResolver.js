const bookData = require('../data/book/bookData')
const NyTimes = require('../data/NyTimes')
const _ = require('lodash')
const Auth = require('../util/Auth')

module.exports = {
  Query: {
    async bestSellerLists(_, __, ctx) {
      await Auth.checkSignInAndConsentAndReturn(ctx.decodedToken._id)
      return NyTimes.getBestSellerLists()
    },
    async bookList(_, { name }, ctx) {
      await Auth.checkSignInAndConsentAndReturn(ctx.decodedToken._id)
      return NyTimes.getBestSellerList(name)
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
