const express = require('express');
const dotenv = require('dotenv').config();
const Instagram = require('node-instagram').default;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');



//config 
const port = process.env.PORT || 3001;
const app = express();
app.use(morgan('dev'));

//config pug and cookieParser
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//config instagram credentials
const instagram = new Instagram({
    clientId: process.env.IG_CLIENT_ID,
    clientSecret: process.env.IG_CLIENT_SECRET,
});

//ruta raiz
app.get('/', (req, res) => {
    res.render('index', { message: 'Welcome to Login with Instagram' });
});

//ruta login
app.get('/login', (req, res) => {
    res.render('login');
});

//ruta Oauth instagram 
app.get('/instagram/authorize', (req, res) => {
    res.redirect(
        instagram.getAuthorizationUrl(process.env.IG_URI_REDIRECT, { scope: ['email', 'instagram_basic', 'user_profile', 'user_photos', 'user_likes'], state: "1" })
    );
});

//ruta de callback of instagram 
app.get('/instagram/callback', async(req, res) => {
    console.log('iniciando session en instagram');

    const data = await instagram.authorizeUser(req.query.code, process.env.IG_URI_REDIRECT, (err, result) => {
        if (err) return res.send(err);
        res.cookie('igToken', result.access_token);
        console.log(result.access_token);
        res.redirect('/instagram/photos')
    });

});

//ruta de photos
app.get('/instagram/photos', (req, res) => {
    try {

        const accessToken = req.cookies.igToken;
        console.log(`token: ${accessToken}`);

        const userId = accessToken.split('.')[0] // ig user id, like: 1633560409
        console.log(userId);
        ig.user_media_recent(userId, (err, result, pagination, remaining, limit) => {
            if (err.code) return res.render('error');
            res.render('photos', { photos: result });
        })
    } catch (e) {
        res.render('error');
    }
});







app.listen(port, () => {
    console.log(`Server on port in ${port}`);
});