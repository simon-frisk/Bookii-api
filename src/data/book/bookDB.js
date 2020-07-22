const { Datastore } = require('@google-cloud/datastore')
const bookIdUtil = require('../../util/bookIdUtil')
const datastore = new Datastore()

module.exports = {
  async getByBookId(bookId) {
    const [book] = await datastore.get(
      datastore.key(['Book', Number(bookIdUtil.getBookIdValue(bookId))])
    )
    return {
      ...book,
      bookId,
    }
  },
}
