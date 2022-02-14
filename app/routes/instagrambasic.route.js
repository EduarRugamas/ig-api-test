const express = require('express');
const { instagramBasicController } = require('../controllers');

const router = express.Router();


router.route('/authorization').get(instagramBasicController.authorizationWithAxios);

router.route('/callback').get(instagramBasicController.userAuthorization);


module.exports = router;
