const axios = require('axios')

module.exports = {
  getExtract: async (title, authors) => {
    try {
      let articles = await getArticles(title, authors)
      articles = articles.filter(article => {
        if (!article.toLowerCase().startsWith(title.toLowerCase())) return false
        if (!article.toLowerCase().includes(authors[0].toLowerCase()))
          return false
        const filmKeywordIndex = getKeywordIndex(article, [
          'film',
          'movie',
          'tv',
        ])
        const bookKeywordIndex = getKeywordIndex(article, [
          'book',
          'memoir',
          'novel',
          'fiction',
          'non-fiction',
        ])
        if (
          filmKeywordIndex >= 0 &&
          (filmKeywordIndex < bookKeywordIndex || bookKeywordIndex < 0)
        )
          return false
        return true
      })
      return articles[0]
    } catch (error) {
      return null
    }
  },
}

function createSearchUrl(query) {
  return `http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json`
}

function createDataUrl(pageid) {
  return `http://en.wikipedia.org/w/api.php?action=query&pageids=${pageid}&prop=extracts&explaintext=true&exintro=true&format=json`
}

function getKeywordIndex(article, keywords) {
  let first = -1
  keywords.forEach(keyword => {
    const index = article.indexOf(keyword)
    if (index >= 0 && (index < first || first === -1)) first = index
  })
  return first
}

async function getArticles(title, authors) {
  const searchResult = await axios.get(
    createSearchUrl(`${title} ${authors[0]}`)
  )
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
