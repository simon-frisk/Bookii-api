const { getBookDataFromISBN } = require('../util/bookdata')

module.exports = {
  async book(userFeedBook) {
    return await getBookDataFromISBN(userFeedBook.isbn)
  },
}
