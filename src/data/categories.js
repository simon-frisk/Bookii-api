const emoji = require('node-emoji')

module.exports = [
  { name: 'Fiction', keywords: ['novel'], icon: emoji.find('📕').emoji },
  {
    name: 'Nonfiction',
    keywords: ['non-fiction', 'nonfiction'],
    icon: emoji.find('📗').emoji,
  },
  {
    name: 'Biographies and memoirs',
    keywords: ['biography', 'memoir', 'autobiography'],
    icon: emoji.find('👩').emoji,
  },
  { name: 'Science', keywords: ['technology'], icon: emoji.find('👩‍🔬').emoji },
  { name: 'Young adult', icon: emoji.find('👩‍👧').emoji },
  {
    name: 'Social sciences',
    keywords: ['history'],
    icon: emoji.find('📖').emoji,
  },
  { name: 'Business', icon: emoji.find('🏢').emoji },
  { name: 'Fantasy', icon: emoji.find('🦄').emoji },
  { name: 'Science fiction', icon: emoji.find('🚀').emoji },
  { name: 'Children', icon: emoji.find('🧒').emoji },
  //Romance
]
