const express = require('express');
const { instagramGraphController } = require('../controllers');

const router = express.Router();

router.route('/photos').get(instagramGraphController.getInformationUser);




module.exports = router;
