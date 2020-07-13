module.exports = {
  extractSubtitleAndMainTitleFromTitles(dataTitle, dataSubtitle) {
    let title, subTitle
    if (dataTitle.includes(':')) {
      const index = dataTitle.indexOf(':')
      title = dataTitle.slice(0, index).trim()

      if (!dataSubtitle) {
        subTitle = dataTitle.slice(index + 1).trim()
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
