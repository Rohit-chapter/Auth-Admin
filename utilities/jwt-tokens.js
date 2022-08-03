const jwt = require("jsonwebtoken");

const User = require("../models/user");

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

    request.tokenData = tokenData;

    next();

  });

};

async function checkTokenExistsInDocument(userId, token) {

  let tokenExists = false;

  const userProfile = await User.findById(userId);

  for (let _token of userProfile.accessTokens) {

    if (_token === token) {
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