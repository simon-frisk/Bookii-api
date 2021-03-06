const _ = require('lodash')
const Auth = require('../util/Auth')
const bookData = require('../data/book/bookData')
const { isBookId } = require('../util/bookIdUtil')
const { UserInputError } = require('apollo-server-express')
const User = require('../data/user.model')

module.exports = {
  Mutation: {
    async addFeedBook(_, { date, comment, bookId, favorite }, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      if (!date) throw new UserInputError('Date required')
      if (!isBookId(bookId)) throw new UserInputError('BookId not valid')
      user.feedBooks.push({ date, comment, bookId, favorite })
      await user.save()
      return user.feedBooks[user.feedBooks.length - 1]
    },
    async updateFeedBook(__, { _id, comment, date, favorite }, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      const toUpdate = user.feedBooks.id(_id)
      if (!toUpdate) throw new UserInputError('Feedbook to update not found')
      if (!_.isString(toUpdate.comment))
        throw new UserInputError('Invalid comment')
      if (!_.isBoolean(toUpdate.favorite))
        throw new UserInputError('Invalid favorite')
      if (!Date.parse(date)) throw new UserInputError('Invalid date')
      toUpdate.comment = comment
      toUpdate.favorite = favorite
      toUpdate.date = date
      await user.save()
      return toUpdate
    },
    async removeFeedBook(_, { _id }, ctx) {
      const user = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      const toRemove = user.feedBooks.id(_id)
      toRemove.remove()
      await user.save()
      return toRemove
    },
    async addFeedBookComment(_, { comment, userId, feedBookId }, ctx) {
      const self = await Auth.checkSignInAndConsentAndReturn(
        ctx.decodedToken._id
      )
      const user = await User.findById(userId)
      const feedBook = user.feedBooks.id(feedBookId)
      feedBook.comments.push({
        user: self._id,
        comment,
      })
      user.save()
      return feedBook
    },
    async removeFeedBookComment(_, { userId, feedBookId, _id }, ctx) {
      await Auth.checkSignInAndConsentAndReturn(ctx.decodedToken._id)
      const user = await User.findById(userId)
      const feedBook = user.feedBooks.id(feedBookId)
      const comment = feedBook.comments.id(_id)
      comment.remove()
      user.save()
      return feedBook
    },
  },
  FeedBook: {
    async book(feedBook) {
      return bookData.getByBookId(feedBook.bookId)
    },
    async user(feedBook) {
      return feedBook.parent()
    },
  },
  FeedBookComment: {
    async user(feedBookComment) {
      return User.findById(feedBookComment.user)
    },
  },
}
