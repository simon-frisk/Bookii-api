const { UserInputError } = require('apollo-server')
const Auth = require('../util/Auth')

module.exports = {
  Mutation: {
    async addWishBook(_, { bookId }, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      if (user.wishBooks.includes(bookId))
        throw new UserInputError('Book already wished')
      user.wishBooks.push(bookId)
      await user.save()
      return bookId
    },
    async removeWishBook(_, { bookId }, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      if (!user.wishBooks.includes(bookId))
        throw new UserInputError("Can't remove book not wished for")
      user.wishBooks.remove(bookId)
      await user.save()
      return bookId
    },
  },
}
