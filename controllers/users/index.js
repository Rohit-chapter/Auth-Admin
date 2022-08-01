const User = require('../../models/user');

const { isValueExists } = require('../../utilities/collections');

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
