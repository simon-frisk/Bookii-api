const axios = require('axios')

module.exports = async (title, author) => {
  try {
    const articleDataArray = await getArticleArray(title)
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

function createSearchUrl(title) {
  return `http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${title}&format=json`
}

function createDataUrl(pageid) {
  return `http://en.wikipedia.org/w/api.php?action=query&pageids=${pageid}&prop=extracts&explaintext=true&exintro=true&format=json`
}

async function getArticleArray(title) {
  const searchResult = await axios.get(createSearchUrl(title))
  const articleIds = searchResult.data.query.search.map(res => res.pageid)
  const dataResult = await Promise.all(
    articleIds.map(pageid => {
      return axios.get(createDataUrl(pageid))
    })
  )
  return dataResult.map(
    (res, index) => res.data.query.pages[articleIds[index]].extract
  )
}

function getKeywordPoint(article) {
  const keywords = [
    'book',
    'novel',
    'memoir',
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
