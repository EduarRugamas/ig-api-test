const express = require('express');
const instagramGraphRoute = require('./instagramgraph.route');
const instagramBasicRoute = require('./instagrambasic.route');

const router = express.Router();

router.get('/', (req, res)=> {
    res.render('index');
});

router.use('/instagram', instagramBasicRoute);
router.use('/instagram/media', instagramGraphRoute);


module.exports = router;
