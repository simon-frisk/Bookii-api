const axios = require('axios')

exports.getBookDataFromISBN = async (isbn) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    )
    if (!data.items) return
    return extractDataFromVolumeInfo(data.items[0].volumeInfo)
  } catch (error) {
    return
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
    return []
  }
}

const extractDataFromVolumeInfo = (data) => {
  const bookIds = data.industryIdentifiers
  if (!bookIds) return
  const isbn10 = bookIds.find((bookId) => bookId.type === 'ISBN_10')
  const isbn13 = bookIds.find((bookId) => bookId.type === 'ISBN_13')
  if (!isbn10 && !isbn13) return
  if (!data.title) return

  return {
    isbn10: isbn10 && isbn10.identifier,
    isbn13: isbn13 && isbn13.identifier,
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
