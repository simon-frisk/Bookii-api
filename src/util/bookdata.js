const axios = require('axios')

exports.getBookDataFromISBN = async (isbn) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    )
    if (!data.items) return
    return extractDataFromVolumeInfo(data.items[0].volumeInfo)
  } catch (error) {}
}

exports.getBooksDataFromQuery = async (query) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=40`
    )
    const volumeInfoArray = data.items.map((item) => item.volumeInfo)
    return volumeInfoArray
      .map(extractDataFromVolumeInfo)
      .filter((book) => book && book.isbn && book.title)
  } catch (error) {}
}

const extractDataFromVolumeInfo = (data) => {
  if (!data.industryIdentifiers) return
  const isbnObject = data.industryIdentifiers.find(
    (identifier) =>
      identifier.type === 'ISBN_13' || identifier.type === 'ISBN_10'
  )
  if (!isbnObject) return

  return {
    isbn: isbnObject.identifier,
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
