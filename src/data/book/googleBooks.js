const axios = require('axios')
const bookUtil = require('../../util/bookUtil')
const bookIdUtil = require('../../util/bookIdUtil')

exports.getBookDataFromBookId = async bookId => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${bookIdUtil.getBookIdValue(
        bookId
      )}&country=SE&key=${process.env.GOOGLE_API_KEY}`
    )
    if (!data.items) return
    return extractDataFromVolumeInfo(data.items[0].volumeInfo)
  } catch (error) {}
}

exports.getBooksDataFromQuery = async query => {
  if (!query) return []
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&country=SE&key=${process.env.GOOGLE_API_KEY}`
    )
    if (data.totalItems === 0) return []
    const volumeInfoArray = data.items.map(item => item.volumeInfo)
    const books = volumeInfoArray
      .map(extractDataFromVolumeInfo)
      .filter(book => book)
    const filteredBooks = filterSearchResults(books)
    return filteredBooks
  } catch (error) {}
}

const extractDataFromVolumeInfo = data => {
  const bookIds = data.industryIdentifiers
  if (!bookIds) return
  const isbn10 = bookIds.find(bookId => bookId.type === 'ISBN_10')
  const isbn13 = bookIds.find(bookId => bookId.type === 'ISBN_13')
  let bookId
  if (isbn13) bookId = 'isbn13:' + isbn13.identifier
  else if (isbn10) bookId = 'isbn10:' + isbn10.identifier
  else return

  if (!data.title) return

  const { title, subtitle } = bookUtil.extractSubtitleAndMainTitleFromTitles(
    data.title,
    data.subtitle
  )

  return {
    bookId,
    title,
    subtitle,
    authors: data.authors,
    pages: data.pageCount,
    publisher: data.publisher,
    published: data.publishedDate,
    thumbnail: data.imageLinks && data.imageLinks.thumbnail,
  }
}

function filterSearchResults(searchBooks) {
  const books = []
  searchBooks.forEach(searchBook => {
    if (!books.some(book => book.title === searchBook.title))
      books.push(searchBook)
  })
  return books
}
