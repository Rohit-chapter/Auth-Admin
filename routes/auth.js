const express = require('express');

const authController = require('../controllers/auth');
const usersController = require('../controllers/users');
const { validateToken } = require('../utilities/jwt-tokens');

const router = express.Router();

router.get('/getLinkedinProfile', authController.getLinkedinProfile);

router.post('/registration', usersController.addUser);

router.post('/login', usersController.loginUser);

router.post('/logout', validateToken, usersController.logoutUser);

module.exports = router;