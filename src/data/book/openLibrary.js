const axios = require('axios')
const { isBookIdTypeISBN, getBookIdValue } = require('../../util/bookIdUtil')
const bookUtil = require('../../util/bookUtil')

exports.getBookDataFromBookId = async function (bookId) {
  if (isBookIdTypeISBN(bookId)) {
    const { data } = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${getBookIdValue(
        bookId
      )}&format=json&jscmd=data`
    )
    for (i in data) return extractData(data[i], bookId)
  }
}

function extractData(data, bookId) {
  if (!data.title) return

  const { title, subTitle } = bookUtil.extractSubtitleAndMainTitleFromTitles(
    data.title,
    data.subTitle
  )

  return {
    bookId,
    title,
    subTitle,
    pages: data.number_of_pages,
    thumbnail: data.cover && data.cover.large,
    authors: data.authors && data.authors.map(author => author.name),
    published: data.publish_date,
    publisher: data.publishers && data.publishers[0].name,
  }
}
