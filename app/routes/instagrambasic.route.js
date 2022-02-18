const express = require('express');
const { instagramBasicController } = require('../controllers');

const router = express.Router();


router.route('/authorization').get(instagramBasicController.authorization);

router.route('/callback').get(instagramBasicController.userAuthorizationWithAxios);


module.exports = router;
