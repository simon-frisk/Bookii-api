const feedBookMutation = require('../feedbook/feedbook.mutation')
const userMutation = require('../user/user.mutation')

module.exports = {
  ...feedBookMutation,
  ...userMutation,
}
