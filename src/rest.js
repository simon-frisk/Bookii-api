const express = require('express')
const bookData = require('./data/book/bookData')
const router = express.Router()
const BookIdScan = require('./work/BookIdScan')

router.get('/nytimesbestsellers', async (req, res) => {
  await bookData.storeBestSellerLists()
  res.end()
})

router.get('/scanbookids', async (req, res) => {
  await BookIdScan.scanAndReplace()
  res.end()
})

module.exports = router
