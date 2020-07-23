const Auth = require('../util/Auth')
const categories = require('../data/categories')
const bookData = require('../data/book/bookData')
const { UserInputError } = require('apollo-server-express')

module.exports = {
  Query: {
    async categories(_, __, ctx) {
      Auth.checkSignInAndConsentAndReturn(ctx.decodedToken._id)
      return categories
    },
    async category(_, { name }, ctx) {
      Auth.checkSignInAndConsentAndReturn(ctx.decodedToken._id)
      const category = categories.find(category => category.name === name)
      if (!category) throw new UserInputError('Category does not exist')
      return category
    },
  },
  Category: {
    async books({ name }) {
      return bookData.getByCategory(name)
    },
  },
}
