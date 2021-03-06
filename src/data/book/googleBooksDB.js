const { Datastore } = require('@google-cloud/datastore')

const datastore = new Datastore()

const storeBookData = async ({
  bookId,
  title,
  subtitle,
  authors,
  pages,
  publisher,
  published,
  thumbnail,
}) => {
  const entity = {
    key: datastore.key(['GoogleBook', bookId]),
    data: [
      { name: 'bookId', value: bookId },
      { name: 'title', value: title },
      subtitle ? { name: 'subtitle', value: subtitle } : undefined,
      authors ? { name: 'authors', value: authors } : undefined,
      pages ? { name: 'pages', value: pages } : undefined,
      publisher ? { name: 'publisher', value: publisher } : undefined,
      published ? { name: 'published', value: published } : undefined,
      thumbnail
        ? {
            name: 'thumbnail',
            value: thumbnail,
            excludeFromIndexes: true,
          }
        : undefined,
    ],
  }
  try {
    await datastore.upsert(entity)
  } catch (e) {
    console.error(e)
  }
}

const getBookData = async bookId => {
  const [book] = await datastore.get(datastore.key(['GoogleBook', bookId]))
  return book
}

module.exports = {
  storeBookData,
  getBookData,
}
