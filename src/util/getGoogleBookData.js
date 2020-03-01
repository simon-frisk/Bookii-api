const axios = require('axios')

module.exports = async isbn => {
    const { data: responseData } = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    const data = responseData.items[0].volumeInfo

    return {
        isbn: data.industryIdentifiers.find(isbn => isbn.type === 'ISBN_13').identifier,
        title: data.title,
        subTitle: data.subtitle,
        authors: data.authors,
        publisher: data.publisher,
        published: data.publishedDate,
        googleRating: data.averageRating,
        googleRatingsCount: data.ratingsCount,
        thumbnail: data.imageLinks.thumbnail,
        pages: data.pageCount
    }
}