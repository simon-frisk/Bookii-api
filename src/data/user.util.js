const { model } = require('mongoose')
const bcrypt = require('bcrypt')

exports.setName = name => {
  if (!this.validateName) return name
  const firstNameLetters = name.split(' ')[0].toLowerCase().split('')
  firstNameLetters[0] = firstNameLetters[0].toUpperCase()
  const lastNameLetters = name.split(' ')[1].toLowerCase().split('')
  lastNameLetters[0] = lastNameLetters[0].toUpperCase()
  return firstNameLetters.join('').concat(' ', lastNameLetters.join(''))
}
exports.validateName = name => {
  if (nameRegex.test(name)) return true
  return false
}
exports.validateEmailNotTaken = async function (email) {
  const user = await model('User').findOne({ email })
  if (user && user._id.toString() !== this._id.toString()) return false
  return true
}
exports.validateEmail = email => {
  if (emailRegex.test(email)) return true
  return false
}

exports.setPassword = password => {
  if (password.length < 6) return '-'
  const hash = bcrypt.hashSync(password, 10)
  return hash
}

const nameRegex = /^[A-ZÅÄÖ][a-zaåä]+ [A-ZÅÄÖ][a-zåäö]+$/ //TODO: Make this international etc.
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
