const { AuthenticationError, ApolloError } = require('apollo-server-express')
const User = require('../data/user.model')

module.exports = {
  async checkSignInAndReturn(_id) {
    const user = await User.findById(_id)
    if (!user) throw new AuthenticationError('Not authorized')
    return user
  },
  async checkSignInAndConsentAndReturn(_id) {
    const user = await User.findById(_id)
    if (!user) throw new AuthenticationError('Not authorized')
    if (!user.latestConsent)
      throw new ApolloError('Latest policies not accepted', 'NOTLATESTCONSENT')
    return user
  },
}
