const User = require('../user/user.model')
const jwt = require('jsonwebtoken-promisified')
const bcrypt = require('bcrypt')

module.exports = {
  async signup(_, { user }) {
    await validateUser(user)
    const password = await bcrypt.hash(user.password, 10)
    const { id } = await User.create({ ...user, password })
    return jwt.signAsync({ userId: id }, process.env.JWT_SECRET)
  }
}

const validateUser = async user => {
  if (!emailRegex.test(user.email)) throw 'Bad email'
  if (!nameRegex.test(user.name)) throw 'Bad name'
  if (!passwordRegex.test(user.password)) throw 'Bad password'
  if (await User.findOne({ email: user.email })) throw 'Email exists'
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const nameRegex = /^[A-ZÅÄÖ][a-zaåä]+ [A-ZÅÄÖ][a-zåäö]+$/
const passwordRegex = /^.{6,}$/
