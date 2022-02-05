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
            scope: ['user_profile', 'user_media', 'user_photos', 'instagram_basic', 'instagram_graph_user_profile', 'instagram_graph_user_media'],
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
        // console.log('token:' + data.access_token);
        const token = data.access_token;
        console.log('token a guardar:' + token);
        localStorage.setItem('token_ig', token);
        res.redirect('/instagram/profile');
    } catch (e) {
        res.json(e)
    }
});



//ruta de profile
app.get('/instagram/profile', async(req, res) => {
    const token = localStorage.getItem('token_ig');
    console.log('token recivido: ' + token);

    try {
        await instagram.get('users/self', { accessToken: token }, (err, result) => {
            if (err) return console.log(err), res.json(err);
            console.log(result);
            res.json(result);
        })
    } catch (error) {
        res.json(error);
    }

});

app.get('/instagram/logout', () => {});



app.listen(port, () => {
    console.log(`
                                        Server on port in ${ port }
                                        `);
});