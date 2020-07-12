module.exports = {
  extractSubtitleAndMainTitleFromTitles(dataTitle, dataSubtitle) {
    let title, subTitle
    if (dataTitle.includes(':')) {
      const index = data.title.indexOf(':')
      title = data.title.slice(0, index).trim()

      if (!dataSubtitle) {
        subTitle = data.title.slice(index + 1).trim()
      } else {
        subTitle = dataSubtitle
      }
    } else {
      title = dataTitle
      subTitle = dataSubtitle
    }
    return { title, subTitle }
  },
}
