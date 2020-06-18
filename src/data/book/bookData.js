const googleBooks = require('./googleBooks')
const nytBooks = require('./nytBooks')
const wikipedia = require('./wikipedia')

module.exports = {
  getByBookId: bookId => googleBooks.getBookDataFromBookId(bookId),
  getByQuery: query => googleBooks.getBooksDataFromQuery(query),
  getNYTBestSellers: () => nytBooks(),
  getWikipediaDescription: (title, author) => wikipedia(title, author),
}
