const mongoose = require('mongoose')

module.exports = async () => {
  await mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => console.log('Connected to database'),
      (err) => console.error(err)
    )
}
