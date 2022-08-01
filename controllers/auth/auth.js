const authUtilities = require('./utilities');

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