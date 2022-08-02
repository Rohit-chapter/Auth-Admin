const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.generateAccessToken = (user) => {

  const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '2m' });

  return accessToken;

};

exports.validateToken = (request, response, next) => {

  const authHeader = request.headers["authorization"];

  if (typeof authHeader === 'undefined') {

    return response.status(400).json({
      error: {
        message: 'Access token is not available'
      }
    });

  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, accessTokenSecret, (error, tokenData) => {

    if (error) {
      return response.status(403).json({
        error: {
          message: 'Invalid token'
        }
      });
    }

    request.tokenData = tokenData;

    next();

  });

};