const express = require('express');
const instagramGraphRoute = require('./instagramgraph.route');
const instagramBasicRoute = require('./instagrambasic.route');

const router = express.Router();

router.use('/instagram', instagramBasicRoute);
router.use('/instagram/media', instagramGraphRoute);


module.exports = router;