const googleBooks = require('./googleBooks')
const nytBooks = require('./nytBooks')

module.exports = {
  getByBookId: bookId => googleBooks.getBookDataFromBookId(bookId),
  getByQuery: query => googleBooks.getBooksDataFromQuery(query),
  getNYTBestSellers: () => nytBooks(),
}
