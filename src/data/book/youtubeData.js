const axios = require('axios')

exports.getVideoIds = async title => {
  try {
    const { data } = await axios.get(createUrl(title))
    return data.items.map(video => video.id.videoId)
  } catch (error) {
    console.log(error.message)
    return []
  }
}

function createUrl(title) {
  return `https://www.googleapis.com/youtube/v3/search?part=id&maxResults=5&q=${title}+book&type=video&key=${process.env.GOOGLE_API_KEY}`
}
