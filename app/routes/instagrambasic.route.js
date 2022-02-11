const express = require('express');
const { instagramBasicController } = require('../controllers');

const router = express.Router();


router.route('/authorize').get(instagramBasicController.Authorization);

router.route('/callback').get(instagramBasicController.userAuthorization)