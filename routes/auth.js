const express = require('express');

const authController = require('../controllers/auth');
const usersController = require('../controllers/users');

const router = express.Router();

router.get('/getLinkedinProfile', authController.getLinkedinProfile);

router.post('/registration', usersController.addUser);

module.exports = router;