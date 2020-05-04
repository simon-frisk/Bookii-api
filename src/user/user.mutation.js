const User = require('../user/user.model')
const jwt = require('jsonwebtoken-promisified')
const checkAuth = require('../util/checkAuth')
const { BlobServiceClient } = require('@azure/storage-blob')
const mimeTypes = require('mime-types')
const dbError = require('../util/dbError')

module.exports = {
  async signup(_, { user: userData }) {
    try {
      const user = await new User(userData).save()
      return jwt.signAsync({ userId: user._id }, process.env.JWT_SECRET)
    } catch (error) {
      dbError(error)
    }
  },

  async updateUser(
    _,
    { user: { email, password, name, profilePicture } },
    { user }
  ) {
    checkAuth(user)
    if (email) user.email = email
    if (password) user.password = password
    if (name) user.name = name
    if (profilePicture) {
      //TODO: check this code and delete old profilePic
      const file = await profilePicture
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
      await blockBlobClient.uploadStream(file.createReadStream())
      const url = `https://bookistorage.blob.core.windows.net/profilepictures/${fileName}`
      user.profilePicturePath = url
    }
    try {
      await user.save()
    } catch (error) {
      dbError(error)
    }
    return user
  },
}
