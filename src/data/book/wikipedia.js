const axios = require('axios')

module.exports = async (title, author) => {
  try {
    const searchResult = await axios.get(createSearchUrl(title))
    const pageids = searchResult.data.query.search.map(res => res.pageid)
    const dataResult = await Promise.all(
      pageids.map(pageid => {
        return axios.get(createDataUrl(pageid))
      })
    )
    let articleDataArray = dataResult.map(
      (res, index) => res.data.query.pages[pageids[index]].extract
    )

    const articlePoints = articleDataArray.map(article => {
      if (article.includes(title)) {
        if (article.includes(author)) {
          return getKeywordPoint(article)
        }
      }
      return null
    })

    let bestArticleIndex = null
    articlePoints.forEach((point, index) => {
      if (
        (point !== null && point > articlePoints[bestArticleIndex]) ||
        bestArticleIndex === null
      )
        bestArticleIndex = index
    })

    return articleDataArray[bestArticleIndex]
  } catch (error) {
    return null
  }
}

const createSearchUrl = title =>
  `http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${title}&format=json`

const createDataUrl = pageid =>
  `http://en.wikipedia.org/w/api.php?action=query&pageids=${pageid}&prop=extracts&explaintext=true&exintro=true&format=json`

function getKeywordPoint(article) {
  const keywords = [
    'book',
    'novel',
    'memoir',
    'written',
    'published',
    'publisher',
    'author',
    'isbn',
  ]
  return keywords.reduce((points, keyword) => {
    if (article.includes(keyword)) return points + 1
    return points
  }, 0)
}
