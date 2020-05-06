const userQuery = require('../user/user.query')
const bookQuery = require('../book/book.query')
const feedQuery = require('../feed')

module.exports = {
  ...userQuery,
  ...bookQuery,
  ...feedQuery,
}
