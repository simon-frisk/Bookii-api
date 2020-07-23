const User = require('../data/user.model')
const bookIdUtil = require('../util/bookIdUtil')
const bookData = require('../data/book/bookData')
const { Datastore } = require('@google-cloud/datastore')

exports.scanAndReplace = async () => {
  await scanAllUsers()
}

async function scanAllUsers() {
  const users = await User.find()
  for (const user of users) {
    user.feedBooks = await Promise.all(
      user.feedBooks.map(async (feedBook, index) => {
        feedBook.bookId = await getUpdatedBookId(feedBook.bookId)
        return feedBook
      })
    )
    user.wishBooks = await Promise.all(user.wishBooks.map(getUpdatedBookId))
    await user.save()
  }
}

async function getUpdatedBookId(bookId) {
  const type = bookIdUtil.getBookIdType(bookId)
  if (type === 'book') {
    return bookId
  } else {
    const book = await bookData.getByBookId(bookId)
    const inDb = await bookData.getSearchDBTitleAndAuthors(
      book.title,
      book.authors
    )
    if (inDb) {
      return `book:${inDb[Datastore.KEY].id}`
    } else {
      return bookId
    }
  }
}
