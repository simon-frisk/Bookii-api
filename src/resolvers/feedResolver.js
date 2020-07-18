const { UserInputError } = require('apollo-server')
const Auth = require('../util/Auth')

module.exports = {
  Query: {
    async feed(_, { after }, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      const numToReturn = 7
      await user.populate('following').execPopulate()
      let feedBooks = user.following.reduce(
        (array, following) => array.concat(following.feedBooks),
        []
      )
      feedBooks.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      if (after) {
        const afterIndex =
          feedBooks.findIndex(
            feedBook => feedBook._id.toString() === after.toString()
          ) + 1
        if (!afterIndex) throw new UserInputError('After index invalid')
        feedBooks = feedBooks.slice(afterIndex, afterIndex + numToReturn)
      } else {
        feedBooks = feedBooks.slice(0, numToReturn)
      }
      return feedBooks
    },
  },
}
