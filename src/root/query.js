const userQuery = require('../user/user.query')
const bookQuery = require('../book/book.query')

module.exports = {
  ...userQuery,
  ...bookQuery,
}
