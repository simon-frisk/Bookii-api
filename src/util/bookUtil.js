module.exports = {
  extractSubtitleAndMainTitleFromTitles(dataTitle, dataSubtitle) {
    let title, subtitle
    if (dataTitle.includes(':')) {
      const index = dataTitle.indexOf(':')
      title = dataTitle.slice(0, index).trim()

      if (!dataSubtitle) {
        subtitle = dataTitle.slice(index + 1).trim()
      } else {
        subtitle = dataSubtitle
      }
    } else {
      title = dataTitle
      subtitle = dataSubtitle
    }
    return { title, subtitle }
  },
}
