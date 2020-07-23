const { Datastore } = require('@google-cloud/datastore')
const { UserInputError } = require('apollo-server-express')

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
