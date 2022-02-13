const express = require('express');
const { instagramBasicController } = require('../controllers');

const router = express.Router();


router.route('/').get(instagramBasicController.index);

router.route('/authorize').get(instagramBasicController.authorization);

router.route('/callback').get(instagramBasicController.userAuthorization);


module.exports = router;
