const axios = require('axios');

const urlToGetLinkedInAccessToken = 'https://www.linkedin.com/oauth/v2/accessToken';
const urlToGetUserProfile = 'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))';
const urlToGetUserEmail = 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))';

const linkedinRedirectURI = process.env.LINKEDIN_REDIRECT_URI;
const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
const linkedinClientSecret = process.env.LINKEDIN_CLIENT_SECRET;

exports.getLinkedinAccessTokenByCode = async (code) => {

  return new Promise(async (resolve, reject) => {

    try {
      let accessToken = null;

      let url = `${urlToGetLinkedInAccessToken}?grant_type=authorization_code&code=${code}&client_id=${linkedinClientId}&redirect_uri=${linkedinRedirectURI}&client_secret=${linkedinClientSecret}`;

      let result = await axios.post(url);

      accessToken = result.data['access_token'];

      resolve(accessToken);

    } catch (exception) {

      reject(exception);

    }

  });

};

exports.getLinkedinProfileByToken = async (token) => {

  return new Promise(async (resolve, reject) => {

    try {

      let userProfile = {};
      const config = {
        headers: { "Authorization": `Bearer ${token}` }
      };

      const result = await axios.get(urlToGetUserProfile, config);

      userProfile.firstName = result.data["localizedFirstName"];
      userProfile.lastName = result.data["localizedLastName"];
      userProfile.id = result.data["id"];

      resolve(userProfile);

    } catch (exception) {

      reject(exception);

    }
  });

};

exports.getLinkedinUserEmailByToken = async (token) => {

  return new Promise(async (resolve, reject) => {
    try {

      let email = null;
      const config = {
        headers: { "Authorization": `Bearer ${token}` }
      };

      const result = await axios.get(urlToGetUserEmail, config);

      email = result.data.elements[0]["handle~"];

      resolve(email);

    } catch (exception) {

      reject(exception);

    }
  });

};