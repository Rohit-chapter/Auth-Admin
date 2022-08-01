const User = require('../../models/user');

const authUtilities = require('./utilities');

exports.addUser = async (request, response, next) => {

  try {

    const body = request.body;

    const firstName = body.firstName;
    const lastName = body.lastName;
    const email = body.email;
    const password = body.password;
    const user = new User(firstName, lastName, email, password,);

    const userId = await user.save();

    const userProfile = await User.findById(userId);

    return response.status(200).json({
      status: 'success',
      statuscode: 200,
      data: {
        user: userProfile
      }
    });

  } catch (exception) {

    return response.status(400).json({
      status: 'error',
      statuscode: 400,
      error: exception
    });

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
    console.log(exception);
  }

};