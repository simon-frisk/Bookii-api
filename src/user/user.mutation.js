const User = require('../user/user.model')
const jwt = require('jsonwebtoken-promisified')
const bcrypt = require('bcrypt')
const validateUser = require('../user/validateUser')

module.exports = {
  async signup(_, { user }) {
    await validateUser(user)
    const password = await bcrypt.hash(user.password, 10)
    const { id } = await User.create({ ...user, password })
    return jwt.signAsync({ userId: id }, process.env.JWT_SECRET)
  },
}
