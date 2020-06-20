const axios = require('axios')

module.exports = async (title, author) => {
  try {
    let articles = await getArticles(title)

    articles = articles
      .filter(article => article.includes(title))
      .filter(article => article.includes(author))
      .filter(article => hasBookKeywordsInFirstSentence(article))

    articles.sort(
      (a1, a2) => numberOtherBookKeywords(a2) - numberOtherBookKeywords(a1)
    )

    return articles[0]
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

async function getArticles(title) {
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

function hasBookKeywordsInFirstSentence(article) {
  const keywords = ['book', 'novel', 'memoir']
  return keywords
    .map(keyword => article.split('.')[0].includes(keyword))
    .includes(true)
}

function numberOtherBookKeywords(article) {
  const keywords = ['author', 'published', 'publisher', 'isbn', 'written']
  return keywords.filter(keyword => article.includes(keyword)).length
}
