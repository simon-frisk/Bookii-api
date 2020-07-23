const nodemailer = require('nodemailer')
const { ApolloError } = require('apollo-server-express')

const transport = nodemailer.createTransport({
  host: 'smtp.migadu.com',
  port: 587,
  secure: false,
  auth: {
    user: 'simon@simonfrisk.com',
    pass: process.env.EMAIL_PASSWORD,
  },
})

module.exports = {
  async sendMail({ to, subject, text }) {
    try {
      await transport.sendMail({
        from: 'simon@simonfrisk.com',
        to,
        subject,
        text,
      })
    } catch (error) {
      console.error(error)
      throw new ApolloError('Failed to send email')
    }
  },
}
