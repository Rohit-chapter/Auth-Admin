const jwt = require("jsonwebtoken");

const User = require("../models/user");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const tokenExpirationDuration = '5m';

exports.generateAccessToken = (user) => {

  const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: tokenExpirationDuration });

  return {
    token: accessToken,
    issuedAt: new Date().getTime(),
    expiresIn: 1000 * 60 * 5
  };

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

  jwt.verify(token, accessTokenSecret, async (error, tokenData) => {

    if (error) {
      return response.status(403).json({
        error: {
          message: 'Invalid token'
        }
      });
    }

    const tokenExists = await checkTokenExistsInDocument(tokenData.userId, token);

    if (tokenExists === false) {
      return response.status(403).json({
        error: {
          message: 'Invalid token'
        }
      });
    }

    tokenData.token = token;
    request.tokenData = tokenData;

    next();

  });

};

async function checkTokenExistsInDocument(userId, token) {

  let tokenExists = false;

  const userProfile = await User.findById(userId);

  for (let accessToken of userProfile.accessTokens) {

    if (accessToken.token === token) {
      tokenExists = true;
      break;
    }

  }

  return tokenExists;

}

// async function removeExpiredTokensFromDocument(userId) {

//   const userProfile = await User.findById(userId);

//   console.log('remove token');

//   const accessTokens = userProfile.accessTokens;

//   const _tokens = [];

//   for (let token of accessTokens) {

//     jwt.verify(token, accessTokenSecret, (error, tokenData) => {
//       if (!error) {
//         _tokens.push(token);
//       }
//     });

//   }

//   console.log(_tokens);

//   return userProfile;

// }