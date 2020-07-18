const { Datastore } = require('@google-cloud/datastore')

const datastore = new Datastore()

exports.getBestSellerLists = async () => {
  const query = datastore.createQuery('NytimesBestsellerLists')
  const [lists] = await datastore.runQuery(query)
  return lists.map(list => ({ ...list, name: list[datastore.KEY].name }))
}
