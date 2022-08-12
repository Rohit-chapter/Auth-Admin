const User = require('../../models/user');

const { isValueExists } = require('../../utilities/collections');
const { generateAccessToken } = require('../../utilities/jwt-tokens');

exports.addUser = async (request, response, next) => {

  try {

    const body = request.body;

    const record = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      authenticationType: body.authenticationType,
      accessTokens: []
    };

    const user = new User(record);

    const users = await User.find();

    const userAlreadyExists = isValueExists(users, 'email', body.email);

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

    const users = await User.find({ email });
    const user = users[0];

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

const storeTokenRecordsInDocument = async (userProfile, accessToken) => {

  const accessTokens = userProfile.accessTokens;

  accessTokens.push(accessToken);

  const user = await User.findById(userProfile._id);

  user.accessTokens = accessTokens;

  await user.save();

};

exports.getAllUsers = async (request, response, next) => {

  try {

    const userId = request.tokenData.userId;

    const users = await User.find();

    //removing owner from the users list
    const filteredUsers = users.filter((user) => {
      return user._id.toString() !== userId;
    });

    return response.status(200).json({ users: filteredUsers });

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

    user.accessTokens = accessTokens;

    user.save();

    return response.status(200).json({
      message: 'Successfully logout!'
    })

  } catch (exception) {
    return response.status(500).json({ error: exception });
  }
};

exports.getMyProfile = async (request, response, next) => {

  try {
    const userId = request.tokenData.userId;

    const user = await User.findById(userId);

    return response.status(200).json({ profile: user });

  } catch (exception) {
    return response.status(500).json({ error: exception });
  }
};

exports.deleteUser = async (request, response, next) => {

  try {
    const userId = request.body.id;

    if (typeof userId === 'undefined') {

      return response.status(500).json({
        error: {
          message: 'User id is not provided!'
        }
      });

    }

    await User.findByIdAndRemove(userId);

    return response.status(200).json({ message: 'User deleted successfully!' });

  } catch (exception) {
    return response.status(500).json({ error: exception });
  }

};