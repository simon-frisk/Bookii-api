const User = require('../user/user.model')
const jwt = require('jsonwebtoken-promisified')
const checkAuth = require('../util/checkAuth')
const { BlobServiceClient } = require('@azure/storage-blob')
const mimeTypes = require('mime-types')
const { UserInputError } = require('apollo-server')

module.exports = {
  async signup(_, { user: userData }) {
    const user = await new User(userData).save()
    return jwt.signAsync({ _id: user._id }, process.env.JWT_SECRET)
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
    await user.save()
    return user
  },
  async follow(_, { _id }, { user }) {
    checkAuth(user)
    //TODO: validate _id is an objectId (and do this in all other similar places too. Otherwise this will throw an internal server error instead of userinputerror)
    const followed = await User.findById(_id)
    if (!followed) throw new UserInputError('The user to follow does not exist')
    if (user.following.find(f => f.toString() === _id.toString()))
      return new UserInputError('The user to follow is already followed')
    user.following.push(_id)
    await user.save()
    followed.followers.push(user._id)
    await followed.save()
    return followed
  },
  async unfollow(_, { _id }, { user }) {
    checkAuth(user)
    const followed = await User.findById(_id)
    if (!followed)
      throw new UserInputError('The user to unfollow does not exist')
    const lengthBefore = user.following.length
    user.following = user.following.filter(f => f.toString() !== _id.toString())
    if (lengthBefore === user.following.length)
      throw new UserInputError('The user to unfollow is not followed')
    await user.save()
    followed.followers = followed.followers.filter(
      f => f.toString() !== user._id.toString()
    )
    await followed.save()
    return followed
  },
}
