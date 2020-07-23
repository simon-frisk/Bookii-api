const { UserInputError } = require('apollo-server-express')
const User = require('../data/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken-promisified')
const { Storage } = require('@google-cloud/storage')
const mimeTypes = require('mime-types')

const storage = new Storage()

module.exports = {
  async validateAndFixEmail(email, _id) {
    if (!email) throw new UserInputError('Email required')
    const fixedEmail = email.trim()
    const user = await User.findOne({ email: fixedEmail })
    if (user && (!_id || user._id.toString() !== _id.toString()))
      throw new UserInputError('Email already taken')
    if (!emailRegex.test(fixedEmail)) throw new UserInputError('Email invalid')
    return fixedEmail
  },
  validateAndFixName(name) {
    if (!name.includes(' ')) throw new UserInputError('Full name required')
    if (/[\d"#¤%&/()=?^*~€$£@}{,.]/.test(name))
      throw new UserInputError('Name contains forbidded characters')
    return name.trim()
  },
  async validatePasswordAndCreateHash(password) {
    if (password.length < 6)
      throw new UserInputError('Password has to be at least 6 characters')
    return bcrypt.hash(password, 10)
  },
  async signJWT(_id) {
    return jwt.signAsync({ _id }, process.env.JWT_SECRET)
  },
  async storeProfilePicture(profilePicture, oldPath, id) {
    const file = await profilePicture
    const bucket = storage.bucket('bookapp-282214.appspot.com')

    if (oldPath) {
      try {
        const array = oldPath.split('/')
        const prevFileName = array.slice(array.length - 2).join('/')
        await bucket.file(prevFileName).delete()
      } catch (e) {}
    }

    const fileName = `profile_pictures/profilePicture_${Date.now()}_${id}.${mimeTypes.extension(
      file.mimetype
    )}`

    await new Promise(resolve => {
      file
        .createReadStream()
        .pipe(
          bucket.file(fileName).createWriteStream({
            resumable: false,
            gzip: true,
          })
        )
        .on('finish', resolve)
    })

    return (
      'https://storage.googleapis.com/bookapp-282214.appspot.com/' + fileName
    )
  },
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
