const axios = require('axios')

module.exports = async list => {
  const { data } = await axios.get(`
    https://api.nytimes.com/svc/books/v3/lists/current/${list}.json?api-key=${process.env.NYT_API_KEY}`)
  return data.results.books.map(extractNYTBookData)
}

function extractNYTBookData(data) {
  return {
    bookId: 'isbn13:' + data.primary_isbn13,
    title: data.title,
    description: data.description,
    authors: [data.author],
    publisher: data.publisher,
    published: data.published_date,
    thumbnail: data.book_image,
  }
}
