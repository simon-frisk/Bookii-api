const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken-promisified')
const User = require('../user/user.model')

module.exports = {
  hello: () => 'hello world',
  async signin(_, { email, password }) {
    const user = await User.findOne({ email })
    if (!user) return
    const correctPassword = await bcrypt.compare(password, user.password)
    if (!correctPassword) return
    return jwt.signAsync({ userId: user._id }, process.env.JWT_SECRET)
  }
}
