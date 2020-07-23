const { Datastore } = require('@google-cloud/datastore')
const { UserInputError } = require('apollo-server-express')
const axios = require('axios')
const emoji = require('node-emoji')
const bookIdUtil = require('../util/bookIdUtil')

const datastore = new Datastore()

exports.getBestSellerLists = async () => {
  const query = datastore.createQuery('NytimesBestsellerLists').order('order')
  const [lists] = await datastore.runQuery(query)
  return lists.map(list => ({ ...list, name: list[datastore.KEY].name }))
}

exports.getBestSellerList = async name => {
  const [list] = await datastore.get(
    datastore.key(['NytimesBestsellerLists', name])
  )
  if (!list) throw new UserInputError('List does not exist')
  return { ...list, name: list[datastore.KEY].name }
}

exports.storeBestSellerLists = async () => {
  for (let index = 0; index < lists.length; index++) {
    const list = lists[index]
    const listData = await getListData(list.name)

    await storeList(listData, list.icon || emoji.get('books'), index)
    await new Promise(resolve => setTimeout(resolve, 10000))
  }
}

async function storeList(list, icon, order) {
  const entity = {
    key: datastore.key(['NytimesBestsellerLists', list.name]),
    data: {
      books: list.bookIds,
      icon,
      order,
    },
    excludeFromIndexes: ['books', 'icon'],
  }
  await datastore.upsert(entity)
}

async function getListData(list) {
  const { data } = await axios.get(createNytURL('/lists.json', `list=${list}`))
  const isbnList = await Promise.all(
    data.results.map(book => `isbn13:${book.book_details[0].primary_isbn13}`)
  )
  const bookIdList = await Promise.all(
    isbnList.map(isbn => bookIdUtil.getUpdatedBookId(isbn))
  )
  return {
    name: data.results[0].display_name,
    bookIds: bookIdList,
  }
}

function createNytURL(path, params) {
  return `https://api.nytimes.com/svc/books/v3${path}?api-key=${process.env.NYT_API_KEY}&${params}`
}

const lists = [
  { name: 'combined-print-and-e-book-fiction', icon: emoji.find('🦄').emoji },
  {
    name: 'combined-print-and-e-book-nonfiction',
    icon: emoji.find('📔').emoji,
  },
  { name: 'young-adult', icon: emoji.find('👧').emoji },
  { name: 'business-books', icon: emoji.find('🏢').emoji },
  { name: 'science', icon: emoji.find('🔬').emoji },
  { name: 'education', icon: emoji.find('👩‍🎓').emoji },
  { name: 'humor', icon: emoji.find('😂').emoji },
  { name: 'sports', icon: emoji.find('🤾‍♀️').emoji },
  { name: 'mass-market-monthly' },
  { name: 'advice-how-to-and-miscellaneous' },
  { name: 'crime-and-punishment', icon: emoji.find('👩‍⚖️').emoji },
  { name: 'race-and-civil-rights' },
  { name: 'culture' },
  { name: 'expeditions-disasters-and-adventures' },
  { name: 'health' },
  { name: 'travel', icon: emoji.find('🌍').emoji },
]
