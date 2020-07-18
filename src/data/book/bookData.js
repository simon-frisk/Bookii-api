const googleBooks = require('./googleBooks')
const nytBooks = require('./nytBooks')
const wikipedia = require('./wikipedia')
const googleBooksDB = require('./googleBooksDB')
const youtubeData = require('./youtubeData')
const { ApolloError } = require('apollo-server')

module.exports = {
  getByBookId: async bookId => {
    let data = await googleBooksDB.getBookData(bookId)
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
  getYoutubeVidoes: title => youtubeData.getVideoIds(title),
}
