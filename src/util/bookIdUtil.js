exports.isBookId = bookId => {
  if (!bookId) return false
  if (!(bookId.split(':').length === 2)) return false
  return true
}

exports.getBookIdValue = bookId => {
  if (!this.isBookId(bookId)) throw new Error('Invalid bookId')
  return bookId.split(':')[1]
}
