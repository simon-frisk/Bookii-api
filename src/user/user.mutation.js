const User = require('../user/user.model')
const jwt = require('jsonwebtoken-promisified')
const bcrypt = require('bcrypt')
const {
  validateEmail,
  validateName,
  validatePassword,
} = require('../user/validateUser')
const checkAuth = require('../util/checkAuth')

module.exports = {
  async signup(_, { user }) {
    await validateEmail(user.email)
    validateName(user.name)
    validatePassword(user.password)
    const password = await bcrypt.hash(user.password, 10)
    const { id } = await User.create({ ...user, password })
    return jwt.signAsync({ userId: id }, process.env.JWT_SECRET)
  },
  async updateUser(
    _,
    { user: { email, password, name, profilePicture } },
    { user }
  ) {
    checkAuth(user)
    if (email) {
      await validateEmail(email)
      user.email = email
    }
    if (password) {
      validatePassword(password)
      const encryptedPassword = await bcrypt.hash(password, 10)
      user.password = encryptedPassword
    }
    if (name) {
      validateName(name)
      user.name = name
    }
    //validate profile picture
    user.save()
    return user
  },
}
