const bookData = require('../data/book/bookData')
const { Datastore } = require('@google-cloud/datastore')
const datastore = new Datastore()

exports.isBookId = bookId => {
  if (!bookId) return false
  if (!(bookId.split(':').length === 2)) return false
  return true
}

exports.getBookIdValue = bookId => {
  if (!this.isBookId(bookId)) throw new Error('Invalid bookId')
  return bookId.split(':')[1]
}

exports.getBookIdType = bookId => {
  if (!this.isBookId(bookId)) throw new Error('Invalid bookId')
  return bookId.split(':')[0]
}

exports.getUpdatedBookId = async bookId => {
  const type = this.getBookIdType(bookId)
  if (type === 'book') {
    return bookId
  } else {
    try {
      const book = await bookData.getByBookId(bookId)
      const inDb = await bookData.getSearchDBTitleAndAuthors(
        book.title,
        book.authors
      )
      if (inDb) {
        return `book:${inDb[datastore.KEY].id}`
      } else {
        return bookId
      }
    } catch (error) {
      return bookId
    }
  }
}
