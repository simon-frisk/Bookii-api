const axios = require('axios')
const { isBookIdTypeISBN, getBookIdValue } = require('../util/bookIdUtil')
const { ApolloError } = require('apollo-server')

exports.getBookDataFromBookId = async (bookId) => {
  if (isBookIdTypeISBN(bookId)) {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${getBookIdValue(
          bookId
        )}`
      )
      if (!data.items) throw new Error()
      return extractDataFromVolumeInfo(data.items[0].volumeInfo)
    } catch (error) {
      throw new ApolloError('Failed to get book data')
    }
  }
}

exports.getBooksDataFromQuery = async (query) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`
    )
    const volumeInfoArray = data.items.map((item) => item.volumeInfo)
    return volumeInfoArray.map(extractDataFromVolumeInfo).filter((book) => book)
  } catch (error) {
    throw new ApolloError('Failed to get book data')
  }
}

const extractDataFromVolumeInfo = (data) => {
  const bookIds = data.industryIdentifiers
  if (!bookIds) return
  const isbn10 = bookIds.find((bookId) => bookId.type === 'ISBN_10')
  const isbn13 = bookIds.find((bookId) => bookId.type === 'ISBN_13')
  const bookId = isbn13 || isbn10
  if (!bookId) return
  if (!data.title) return

  return {
    bookId: bookId.identifier,
    title: data.title,
    subTitle: data.subtitle,
    description: data.description,
    authors: data.authors,
    pages: data.pageCount,
    publisher: data.publisher,
    published: data.publishedDate,
    thumbnail: data.imageLinks && data.imageLinks.thumbnail,
  }
}
