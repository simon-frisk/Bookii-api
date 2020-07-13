const bookData = require('../data/book/bookData')
const _ = require('lodash')

module.exports = {
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
