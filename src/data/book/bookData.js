const googleBooks = require('./googleBooks')
const wikipedia = require('./wikipedia')
const googleBooksDB = require('./googleBooksDB')
const youtubeData = require('./youtubeData')
const { ApolloError } = require('apollo-server-express')
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
      let book = await googleBooksDB.getBookData(bookId)
      if (!book) {
        book = await googleBooks.getBookDataFromBookId(bookId)
        if (!book) throw new ApolloError('Failed to get book data')
        await googleBooksDB.storeBookData(book)
      }
      return book
    }
  },
  getByQuery: query => googleBooks.getBooksDataFromQuery(query),
  getByCategory: name => bookDB.getByCategory(name),
  getWikipediaDescription: (title, author) => wikipedia(title, author),
  getYoutubeVidoes: title => youtubeData.getVideoIds(title),
  getSearchDBTitleAndAuthors: (title, authors) =>
    bookDB.searchTitleAndAuthors(title, authors),
}
