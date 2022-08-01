const User = require('../../models/user');

const { isValueExists } = require('../../utilities/collections');

const authUtilities = require('./utilities');

exports.addUser = async (request, response, next) => {

  try {

    const body = request.body;

    const firstName = body.firstName;
    const lastName = body.lastName;
    const email = body.email;
    const password = body.password;
    const user = new User(firstName, lastName, email, password,);

    const users = await User.fetchAll();

    const userAlreadyExists = isValueExists(users, 'email', email);

    if (userAlreadyExists === true) {

      return response.status(409).json({
        error: {
          message: 'User with this email already exists. Please login.'
        }
      });

    }

    const userId = await user.save();

    const userProfile = await User.findById(userId);

    return response.status(200).json({ user: userProfile });

  } catch (exception) {

    return response.status(400).json({ error: exception });

  }

};

exports.getLinkedinProfile = async (request, response, next) => {

  try {

    let user = {};

    const code = request.query.code;

    const accessToken = await authUtilities.getLinkedinAccessTokenByCode(code);

    const userProfile = await authUtilities.getLinkedinProfileByToken(accessToken);

    const userEmail = await authUtilities.getLinkedinUserEmailByToken(accessToken);

    user = {
      ...userProfile,
      profileImage: null,
      email: userEmail.emailAddress
    };

    let resStatus = 400;

    if (!(accessToken === null || userProfile === null || userEmail === null)) {
      resStatus = 200;
    }

    response.status(resStatus).json({ user });

  } catch (exception) {
    response.status(400).json({ error: exception });
  }

};