const mongoose = require('mongoose')

module.exports = async () => {
  await mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => console.log('Connected to atlas'),
      err => console.error(err)
    )
}
