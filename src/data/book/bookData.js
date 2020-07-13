const googleBooks = require('./googleBooks')
const openLibrary = require('./openLibrary')
const nytBooks = require('./nytBooks')
const wikipedia = require('./wikipedia')
const googleBooksDB = require('./googleBooksDB')
const { ApolloError } = require('apollo-server')

module.exports = {
  getByBookId: async bookId => {
    let data = await openLibrary.getBookDataFromBookId(bookId)
    if (!data) data = await googleBooksDB.getBookData(bookId)
    if (!data) {
      data = await googleBooks.getBookDataFromBookId(bookId)
      if (!data) throw new ApolloError('Failed to get book data')
      await googleBooksDB.storeBookData({
        ...data,
      })
    }
    return data
  },
  getByQuery: query => googleBooks.getBooksDataFromQuery(query),
  getNYTBestSellers: () => nytBooks.getBestSellerLists(),
  getWikipediaDescription: (title, author) => wikipedia(title, author),
}
