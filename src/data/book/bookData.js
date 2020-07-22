const googleBooks = require('./googleBooks')
const nytBooks = require('./nytBooks')
const wikipedia = require('./wikipedia')
const googleBooksDB = require('./googleBooksDB')
const youtubeData = require('./youtubeData')
const { ApolloError } = require('apollo-server')
const bookIdUtil = require('../../util/bookIdUtil')
const bookDB = require('./bookDB')

module.exports = {
  getByBookId: async bookId => {
    const bookIdType = bookIdUtil.getBookIdType(bookId)
    if (bookIdType === 'book') {
      const book = await bookDB.getByBookId(bookId)
      if (!book) throw new ApolloError('Failed to get book data')
      return book
    } else if (bookIdType === 'isbn10' || bookIdType === 'isbn13') {
      let data = await googleBooksDB.getBookData(bookId)
      if (!data) {
        data = await googleBooks.getBookDataFromBookId(bookId)
        if (!data) throw new ApolloError('Failed to get book data')
        await googleBooksDB.storeBookData({
          ...data,
        })
      }
      return data
    }
  },
  getByQuery: query => googleBooks.getBooksDataFromQuery(query),
  getNYTBestSellerLists: () => nytBooks.getBestSellerLists(),
  getNYTBestSellerList: name => nytBooks.getBestSellerList(name),
  getByCategory: name => bookDB.getByCategory(name),
  getWikipediaDescription: (title, author) => wikipedia(title, author),
  getYoutubeVidoes: title => youtubeData.getVideoIds(title),
}
