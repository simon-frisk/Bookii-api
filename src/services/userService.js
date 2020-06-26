const { UserInputError } = require('apollo-server')
const User = require('../data/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken-promisified')

module.exports = {
  async validateEmail(email, _id) {
    if (!email) throw new UserInputError('Email required')
    const user = await User.findOne({ email })
    if (user && user._id.toString() !== _id.toString())
      throw new UserInputError('Email already taken')
    if (!emailRegex.test(email)) throw new UserInputError('Email invalid')
  },
  validateAndFixName(name) {
    const names = name.split(' ')
    if (!names.length === 2)
      throw new UserInputError('Name has to consist of first- and lastname')
    const firstNameLetters = names[0].toLowerCase().split('')
    firstNameLetters[0] = firstNameLetters[0].toUpperCase()
    const lastNameLetters = names[1].toLowerCase().split('')
    lastNameLetters[0] = lastNameLetters[0].toUpperCase()
    const fixedName = firstNameLetters
      .join('')
      .concat(' ', lastNameLetters.join(''))
    if (!nameRegex.test(fixedName))
      throw new UserInputError('Name has to consist of first- and lastname')
    return fixedName
  },
  validatePasswordAndCreateHash(password) {
    if (password.length < 6)
      throw new UserInputError('Password has to be at least 6 characters')
    return bcrypt.hash(password, 10)
  },
  signJWT(_id) {
    return jwt.signAsync({ _id }, process.env.JWT_SECRET)
  },
}

const nameRegex = /^[A-ZÅÄÖ][a-zaåä]+ [A-ZÅÄÖ][a-zåäö]+$/ //TODO: Make this international etc.
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
