const express = require('express');
const { instagramGraphController } = require('../controllers');

const router = express.Router();

router.route('/photos').get(instagramGraphController.getInformationMedia);
router.route('/user').get(instagramGraphController.getInformatioUser);




module.exports = router;
