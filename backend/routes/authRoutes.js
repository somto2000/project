const express = require('express');
const router = express.Router();
const { registerEnrollee, loginEnrollee, logoutEnrollee } = require('../controllers/authController');
const { getEnrolleeProfile, updateEnrolleeProfile } = require('../controllers/enrolleeController');
router.post('/register', registerEnrollee);
router.post('/login', loginEnrollee);
router.post('/logout', logoutEnrollee);
router.get('/getProfile', getEnrolleeProfile);
router.put( '/updateProfile', updateEnrolleeProfile);

module.exports = router;
