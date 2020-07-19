const axios = require('axios')
const { Datastore } = require('@google-cloud/datastore')

const datastore = new Datastore()

exports.getVideoIds = async title => {
  try {
    const dbIds = await getVideoIdsFromDB(title)
    if (dbIds) return dbIds
    const apiIds = await getVideoIdsFromAPI(title)
    await storeVideoIds(title, apiIds)
    return apiIds
  } catch (error) {
    console.log(error.message)
    return []
  }
}

async function getVideoIdsFromAPI(title) {
  const { data } = await axios.get(createUrl(title))
  return data.items.map(video => video.id.videoId)
}

async function getVideoIdsFromDB(title) {
  const [videoIds] = await datastore.get(
    datastore.key(['YoutubeVideos', title])
  )
  if (videoIds) return videoIds.ids
}

async function storeVideoIds(title, ids) {
  const entity = {
    key: datastore.key(['YoutubeVideos', title]),
    data: {
      ids,
    },
    excludeFromIndexes: ['ids'],
  }
  await datastore.upsert(entity)
}

function createUrl(title) {
  return `https://www.googleapis.com/youtube/v3/search?part=id&q=${title}+book&type=video&videoEmbeddable=true&videoDuration=medium&key=${process.env.GOOGLE_API_KEY}`
}
