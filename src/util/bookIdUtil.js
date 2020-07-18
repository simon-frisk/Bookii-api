exports.isBookId = bookId => {
  if (!bookId) return false
  if (!(bookId.split(':').length === 2)) return false
  return true
}

exports.getBookIdType = bookId => {
  if (!this.isBookId(bookId)) return
  return bookId.split(':')[0]
}

exports.getBookIdValue = bookId => {
  if (!this.isBookId(bookId)) return
  return bookId.split(':')[1]
}

exports.isBookIdTypeISBN = bookId => {
  if (!this.isBookId(bookId)) return false
  return this.getBookIdType(bookId).startsWith('isbn')
}

exports.doesISBNBookIdsMatch = (bookId1, bookId2) => {
  if (!(this.isBookIdTypeISBN(bookId1) && this.isBookIdTypeISBN(bookId2)))
    return false
  const type1 = this.getBookIdType(bookId1)
  const type2 = this.getBookIdType(bookId2)
  if (type1 == type2) return bookId1 == bookId2

  const isbn10 = this.getBookIdValue(
    [bookId1, bookId2].find(bookId => bookId.startsWith('isbn10'))
  )
  const isbn13 = this.getBookIdValue(
    [bookId1, bookId2].find(bookId => bookId.startsWith('isbn13'))
  )

  let isbn10In13 = '978' + isbn10.slice(0, -1)
  let sum = 0

  for (i = 0; i < 12; i++) {
    const multiple = i % 2 == 0 ? 1 : 3
    sum += isbn10In13.charAt(i) * multiple
  }
  const sumModulo = sum % 10
  const checkDigit = sumModulo == 0 ? sumModulo : 10 - sumModulo

  isbn10In13 += checkDigit

  return isbn10In13 == isbn13
}
