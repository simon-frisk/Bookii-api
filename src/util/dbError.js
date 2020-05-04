const { ApolloError } = require('apollo-server')

module.exports = (error) => {
  if (error.errors) {
    const errors = []
    for (let e in error.errors) {
      errors.push(error.errors[e].message)
    }
    throw new ApolloError(errors.join(', '))
  } else throw new ApolloError('Unknown error occured')
}
