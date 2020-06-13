const axios = require('axios')
const { isBookIdTypeISBN, getBookIdValue } = require('./bookIdUtil')
const { ApolloError } = require('apollo-server')

exports.getBookDataFromBookId = async bookId => {
  if (isBookIdTypeISBN(bookId)) {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${getBookIdValue(
          bookId
        )}`
      )
      if (!data.items) return
      return extractDataFromVolumeInfo(data.items[0].volumeInfo)
    } catch (error) {
      throw new ApolloError('Failed to get book data')
    }
  }
  return
}

exports.getBooksDataFromQuery = async (query, page) => {
  if (!query) return []
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&startIndex=${
        page * 10 || 0
      }`
    )
    if (data.totalItems === 0) return []
    const volumeInfoArray = data.items.map(item => item.volumeInfo)
    return volumeInfoArray.map(extractDataFromVolumeInfo).filter(book => book)
  } catch (error) {
    throw new ApolloError('Failed to get book data')
  }
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

  let title, subTitle
  if (data.title.includes(':') && !data.subTitle) {
    const index = data.title.indexOf(':')
    const title = data.title.slice(0, index)
    const subTitle = data.title.slice(index)
  } else {
    title = data.title
    subTitle = data.subTitle
  }

  return {
    bookId: bookId,
    title,
    subTitle,
    description: data.description,
    authors: data.authors,
    pages: data.pageCount,
    publisher: data.publisher,
    published: data.publishedDate,
    thumbnail: data.imageLinks && data.imageLinks.thumbnail,
  }
}
