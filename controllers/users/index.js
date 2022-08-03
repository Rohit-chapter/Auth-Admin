const User = require('../../models/user');

const { isValueExists } = require('../../utilities/collections');
const { generateAccessToken } = require('../../utilities/jwt-tokens');

exports.addUser = async (request, response, next) => {

  try {

    const body = request.body;

    const firstName = body.firstName;
    const lastName = body.lastName;
    const email = body.email;
    const password = body.password;
    const authenticationType = body.authenticationType;
    const user = new User(firstName, lastName, email, password, authenticationType, null, []);

    const users = await User.fetchAll();

    const userAlreadyExists = isValueExists(users, 'email', email);

    if (userAlreadyExists === true) {

      return response.status(400).json({
        error: {
          message: 'User with this email already exists. Please login.'
        }
      });

    }

    const userId = await user.save();

    const userProfile = await User.findById(userId);

    const accessToken = generateAccessToken({ userId: userProfile._id.toString() });

    await storeTokenRecordsInDocument(userProfile, accessToken);

    const data = {
      user: userProfile,
      accessToken
    };

    return response.status(200).json(data);

  } catch (exception) {

    console.log(exception);

    return response.status(500).json({ error: exception });

  }

};

exports.loginUser = async (request, response, next) => {

  try {

    const body = request.body;

    const email = body.email;
    const password = body.password;

    const user = await User.findByEmail(email);

    if (user === null) {
      return response.status(400).json({
        error: {
          message: 'User with this email not found. Please register.'
        }
      });
    }

    if (user.password !== password) {
      return response.status(400).json({
        error: {
          message: 'Password mismatch'
        }
      });
    }

    const accessToken = generateAccessToken({ userId: user._id.toString() });

    await storeTokenRecordsInDocument(user, accessToken);

    const data = {
      user,
      accessToken
    };

    return response.status(200).json(data);

  } catch (exception) {

    return response.status(500).json({ error: exception });

  }

};

async function storeTokenRecordsInDocument(userProfile, accessToken) {

  const accessTokens = userProfile.accessTokens;

  accessTokens.push(accessToken);

  const updatedUser = {
    ...userProfile,
    accessTokens
  };

  await User.updateUser(updatedUser);

}

exports.getAllUsers = async (request, response, next) => {

  try {

    const users = await User.fetchAll();

    return response.status(200).json({ users });

  } catch (exception) {
    return response.status(500).json({ error: exception });
  }

};

exports.logoutUser = async (request, response, next) => {

  try {

    const tokenData = request.tokenData;

    const user = await User.findById(tokenData.userId);

    const accessTokens = user.accessTokens.filter((accessToken) => {
      return accessToken.token !== tokenData.token;
    });

    const updatedUser = {
      ...user,
      accessTokens
    };

    await User.updateUser(updatedUser);

    return response.status(200).json({
      message: 'Successfully logout!'
    })

  } catch (exception) {
    return response.status(500).json({ error: exception });
  }
};