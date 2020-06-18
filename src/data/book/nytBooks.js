const axios = require('axios')

module.exports = async () => {
  const { data } = await axios.get(
    `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${process.env.NYT_API_KEY}`
  )
  return data.results.lists.map(extractList)
}

function extractList(list) {
  return {
    name: list.display_name,
    books: list.books.map(extractBookData),
  }
}

function extractBookData(data) {
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
