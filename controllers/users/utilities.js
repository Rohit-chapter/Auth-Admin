exports.storeTokenRecordsInDocument = async (userProfile, accessToken) => {

  const accessTokens = userProfile.accessTokens;

  accessTokens.push(accessToken);

  const updatedUser = {
    ...userProfile,
    accessTokens
  };

  await User.updateUser(updatedUser);

};