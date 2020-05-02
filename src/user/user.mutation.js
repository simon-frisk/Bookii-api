const User = require('../user/user.model')
const jwt = require('jsonwebtoken-promisified')
const bcrypt = require('bcrypt')
const {
  validateEmail,
  validateName,
  validatePassword,
  validateProfilePicture,
} = require('../user/validateUser')
const checkAuth = require('../util/checkAuth')
const { BlobServiceClient } = require('@azure/storage-blob')
const mimeTypes = require('mime-types')

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
    if (profilePicture) {
      const file = await profilePicture
      validateProfilePicture(file)
      const fileName = `profilePicture_${user._id}.${mimeTypes.extension(
        file.mimetype
      )}`

      const blobServiceClient = await BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING
      )
      const containerClient = await blobServiceClient.getContainerClient(
        'profilepictures'
      )

      const blockBlobClient = containerClient.getBlockBlobClient(fileName)
      const response = await blockBlobClient.uploadStream(
        file.createReadStream()
      )
      const url = `https://bookistorage.blob.core.windows.net/profilepictures/${fileName}`
      user.profilePicturePath = url
    }
    user.save()
    return user
  },
}
