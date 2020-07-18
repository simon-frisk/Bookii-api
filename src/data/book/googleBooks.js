const axios = require('axios')
const { getBookIdValue } = require('../../util/bookIdUtil')
const bookUtil = require('../../util/bookUtil')

exports.getBookDataFromBookId = async bookId => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${getBookIdValue(
        bookId
      )}&country=SE&key=${process.env.GOOGLE_API_KEY}`
    )
    if (!data.items) return
    return extractDataFromVolumeInfo(data.items[0].volumeInfo)
  } catch (error) {
    console.error(error.response.data)
  }
}

exports.getBooksDataFromQuery = async query => {
  if (!query) return []
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&country=SE&key=${process.env.GOOGLE_API_KEY}`
    )
    if (data.totalItems === 0) return []
    const volumeInfoArray = data.items.map(item => item.volumeInfo)
    return volumeInfoArray.map(extractDataFromVolumeInfo).filter(book => book)
  } catch (error) {
    console.error(error.response.data)
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

  const { title, subTitle } = bookUtil.extractSubtitleAndMainTitleFromTitles(
    data.title,
    data.subTitle
  )

  return {
    bookId,
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
