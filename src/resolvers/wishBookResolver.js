const checkAuth = require('../util/checkAuth')
const { UserInputError } = require('apollo-server')

module.exports = {
  Mutation: {
    async addWishBook(_, { bookId }, { user }) {
      checkAuth(user)
      if (user.wishBooks.includes(bookId))
        throw new UserInputError('Book already wished')
      user.wishBooks.push(bookId)
      await user.save()
      return bookId
    },
    async removeWishBook(_, { bookId }, { user }) {
      checkAuth(user)
      if (!user.wishBooks.includes(bookId))
        throw new UserInputError("Can't remove book not wished for")
      user.wishBooks.remove(bookId)
      await user.save()
      return bookId
    },
  },
}
