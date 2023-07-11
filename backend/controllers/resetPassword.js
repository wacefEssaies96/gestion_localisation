const sgMail = require('@sendgrid/mail')
API_KEY = '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'
const User = require('../models/Users/user')
const tokenForUser = require('../utils/tokengenerator');

sgMail.setApiKey(API_KEY)

exports.send = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    const token = tokenForUser(user)
    user.resettoken = token
    await user.save()
    const link = `${req.protocol}://localhost:3000/reset-password?token=${token}`

    await sgMail.send({
      to: req.body.email,
      from: 'wacef.stratrait@gmail.com',
      subject: 'Reset password',
      html:
        `<div>Click the link below to reset your password</div>
        <br/>
        <div>${link}</div>`
    })
      .then(data => res.send({ result: data }))
      .catch(err => res.send(err))
  }
  else {
    res.status(404).send({ message: 'User not found !' })
  }
}

exports.resetPassword = async (req, res) => {
  const { newPassword, token } = req.body
  const user = await User.findOne({ resettoken: token })
  if (user) {
    user.password = newPassword
    await user.save()
    return res.send({ message: "Password updated successfully !" })
  }
  res.status(404).send({ message: `User not found !` })
}