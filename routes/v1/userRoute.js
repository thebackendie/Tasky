const express = require('express');
const userController = require('../controllers/v1/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/reactivate-account', userController.reactivateAccount);


// Protect all routes after this middleware
router.use(authMiddleware);
router.post('/profile', userController.getAccount);
router.post('/update-profile', userController.updateAccount);
router.get('/update-password', userController.updatePassword);
router.get('/terminate-account', userController.terminateAccount);

// :id
router
.route('/:id')
.get(isAdmin,userController.getUser)


// Accounts control  
router.patch('/activate/:id', isAdmin, userController.activateUser);
router.patch('/deactivate/:id', isAdmin, userController.deactivateUser);
  

module.exports = router;
