const { AuthenticationError } = require('apollo-server')

module.exports = (user) => {
  if (!user) throw new AuthenticationError('Not authorized')
}
