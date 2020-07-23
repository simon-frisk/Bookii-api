const express = require('express')
const bookData = require('./data/book/bookData')
const router = express.Router()
const BookIdScan = require('./data/BookIdScan')

router.get('/nytimesbestsellers', async (_, res) => {
  await bookData.storeBestSellerLists()
  res.end()
})

router.get('/scanbookids', async (_, res) => {
  await BookIdScan.scanAndReplace()
  res.end()
})

module.exports = router
