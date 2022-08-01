const express = require('express');

const authController = require('../controllers/auth/auth');

const router = express.Router();

router.get('/getLinkedinProfile', authController.getLinkedinProfile);

router.post('/registration', authController.addUser);

module.exports = router;