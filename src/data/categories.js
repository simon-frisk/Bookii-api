const emoji = require('node-emoji')

module.exports = [
  //{ name: 'Fiction', keywords: ['novel'] },
  {
    name: 'Nonfiction',
    keywords: ['non-fiction', 'nonfiction'],
    icon: emoji.find('📖').emoji,
  },
  {
    name: 'Biographies and memoirs',
    keywords: ['biography', 'memoir'],
    icon: emoji.find('👩').emoji,
  },
  { name: 'Science', icon: emoji.find('👩‍🔬').emoji },
  { name: 'Young adult', icon: emoji.find('👩‍👧').emoji },
  //{ name: 'Social sciences' },
  //{ name: 'Self help' },
  //{ name: 'Science fiction' },
  //{ name: 'Fantasy' },
  //{ name: 'Romance' },
]
