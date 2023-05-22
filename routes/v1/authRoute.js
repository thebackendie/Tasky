const express = require('express');
const authController = require('../../controllers/v1/authController');
const { authMiddleware } = require('../../middlewares/authHandler');
const checkRequiredFields  = require('../../middlewares/v1/checkRequiredFields');
const router = express.Router();

router.post('/join-us', checkRequiredFields(['first_name', 'last_name', 'phone_no', 'email', 'password']), authController.signUp);
router.post('/login', checkRequiredFields(['email', 'password']), authController.login);

// Protect Routes
router.use(authMiddleware);
router.post('/refresh', authController.handleRefreshToken);
router.post('/logout', authController.logout);

module.exports = router;