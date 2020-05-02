const { UserInputError } = require('apollo-server')
const User = require('./user.model')

exports.validateEmail = async (email) => {
  if (!emailRegex.test(email)) throw new UserInputError('Not valid email')
  if (await User.findOne({ email }))
    throw new UserInputError('Email already in use')
}

exports.validateName = (name) => {
  if (!nameRegex.test(name)) throw new UserInputError('Not valid name')
}

exports.validatePassword = (password) => {
  if (!passwordRegex.test(password))
    throw new UserInputError('Password too short')
}

exports.validateProfilePicture = (file) => {
  if (!file.mimetype.startsWith('image/'))
    throw new UserInputError('Profilepicture has to be an image')
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const nameRegex = /^[A-ZÅÄÖ][a-zaåä]+ [A-ZÅÄÖ][a-zåäö]+$/
const passwordRegex = /^.{6,}$/
