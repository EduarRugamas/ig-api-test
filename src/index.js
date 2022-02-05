const express = require('express');
const dotenv = require('dotenv').config();
const Instagram = require('node-instagram').default;
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const engine = require('ejs-mate');
const { json } = require('express/lib/response');
const { parse } = require('path');


//config 
const port = process.env.PORT || 3001;
const app = express();
app.use(morgan('dev'));

//config ejs and cookieParser
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(cookieParser());

//config instagram credentials
const instagram = new Instagram({
    clientId: process.env.IG_CLIENT_ID,
    clientSecret: process.env.IG_CLIENT_SECRET,
});

//ruta raiz
app.get('/', (req, res) => {
    res.render('index');
});

//ruta login
app.get('/login', (req, res) => {
    res.redirect('/instagram/authorize');
});

//ruta Oauth instagram 
app.get('/instagram/authorize', (req, res) => {
    res.redirect(
        instagram.getAuthorizationUrl(process.env.IG_URI_REDIRECT, {
            scope: ['user_profile', 'instagram_basic', 'user_photos'],
            state: "1"
        })
    );
});

//ruta de callback of instagram 
app.get('/instagram/callback', async(req, res) => {
    console.log('iniciando session en instagram');

    try {
        const code = req.query.code;
        const data = await instagram.authorizeUser(code, process.env.IG_URI_REDIRECT);
        console.log('token: ' + data.access_token);
        //token a guardar en localstorage
        localStorage.setItem('token_ig', data.access_token);
        console.log('informacion: ' + JSON.stringify(data));
        // res.json(user);
        res.redirect('/instagram/profile');
    } catch (e) {
        res.json(e)
    }
});



//ruta de profile
app.get('/instagram/profile', async(req, res) => {

    const token = localStorage.getItem('ig_token');
    console.log(`existe token ${token}`);
    const user = await instagram.get('users/self', {
        accessToken: token
    });
    res.json(user);
});

app.get('/instagram/logout', () => {});



app.listen(port, () => {
    console.log(`
                                        Server on port in ${ port }
                                        `);
});