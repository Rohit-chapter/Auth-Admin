const express = require('express');

const authController = require('../controllers/auth/auth');

const router = express.Router();

router.get('/getLinkedinProfile', authController.getLinkedinProfile);

module.exports = router;