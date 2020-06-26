const checkAuth = require('../util/checkAuth')
const { UserInputError } = require('apollo-server')

module.exports = {
  Mutation: {
    async addFavoriteBook(_, { _id }, { user }) {
      checkAuth(user)
      const feedBook = await user.feedBooks.id(_id)
      if (!feedBook) throw new UserInputError('Book to favorite is not on feed')
      if (user.favoriteBooks.includes(_id))
        throw new UserInputError('FeedBook already favorite')
      user.favoriteBooks.push(_id)
      await user.save()
      return feedBook
    },
    async removeFavoriteBook(_, { _id }, { user }) {
      checkAuth(user)
      if (!user.favoriteBooks.includes(_id))
        throw new UserInputError('FeedBook is not a favorite')
      const feedBook = await user.feedBooks.id(_id)
      user.favoriteBooks.remove(_id)
      await user.save()
      return feedBook
    },
  },
}
