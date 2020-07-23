const express = require('express')
const NyTimes = require('./data/NyTimes')
const router = express.Router()
const BookIdScan = require('./data/BookIdScan')

router.get('/nytimesbestsellers', async (_, res) => {
  await NyTimes.storeBestSellerLists()
  res.end()
})

router.get('/scanbookids', async (_, res) => {
  await BookIdScan.scanAndReplace()
  res.end()
})

module.exports = router
