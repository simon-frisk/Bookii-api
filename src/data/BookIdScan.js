const User = require('./user.model')
const bookIdUtil = require('../util/bookIdUtil')

exports.scanAndReplace = async () => {
  await scanAllUsers()
}

async function scanAllUsers() {
  const users = await User.find()
  for (const user of users) {
    user.feedBooks = await Promise.all(
      user.feedBooks.map(async feedBook => {
        feedBook.bookId = await bookIdUtil.getUpdatedBookId(feedBook.bookId)
        return feedBook
      })
    )
    user.wishBooks = await Promise.all(
      user.wishBooks.map(bookIdUtil.getUpdatedBookId)
    )
    await user.save()
  }
}
