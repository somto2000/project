const express = require('express');
const router = express.Router();

const { getEnrolleeProfile, updateEnrolleeProfile } = require('../controller/enrolleeController')

router.get('/Profile/:id', getEnrolleeProfile );
router.put('/Profile', updateEnrolleeProfile );
    
    

module.exports = router;
