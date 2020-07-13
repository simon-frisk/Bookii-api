const { Datastore } = require('@google-cloud/datastore')

const datastore = new Datastore()

exports.getBestSellerLists = async () => {
  const query = datastore.createQuery('NytimesBestsellerLists')
  const [result] = await datastore.runQuery(query)
  return result
}
