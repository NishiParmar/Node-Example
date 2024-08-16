const { JwtRsaVerifier } = require('aws-jwt-verify')
const { JwtExpiredError } = require('aws-jwt-verify/error')

require('dotenv').config()

const authMiddleware = async (req, res, next) => {
  const accessToken = req.headers.accesstoken

  const verifier = JwtRsaVerifier.create([
    {
      issuer: `https://cognito-idp.ap-southeast-2.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}`,
      // userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      audience: null,
      tokenUse: 'access',
      clientId: process.env.COGNITO_CLIENT_ID,
    },
    {
      issuer: 'https://accounts.google.com',
      audience: null,
      jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
    },
    {
      issuer: 'accounts.google.com',
      audience: null,
      jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
    }
  ])

  try {
    const user = await verifier.verify(accessToken)
    req.user = user
    next()
  } catch (error) {
    let err = error
    if (error instanceof JwtExpiredError) {
      err = { message: error.message, status: 401 }
    }
    next(err)
  }
}

module.exports = authMiddleware