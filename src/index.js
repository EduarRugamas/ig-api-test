const express = require('express');
const dotenv = require('dotenv').config();
const Instagram = require('node-instagram').default;
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const engine = require('ejs-mate');



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
            scope: ['user_profile', 'instagram_graph_user_profile', 'instagram_graph_user_media'],
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
        // const token = data.access_token;
        // console.log('token a guardar:' + token);
        // localStorage.setItem('token_ig', token);
        // res.json(data);
        res.redirect('/instagram/profile');
    } catch (e) {
        res.json(e);
    }
});



//ruta de profile
app.get('/instagram/profile', async(req, res) => {
    instagram.get('users/self', (err, data) => {
        if (err) {
            console.log('error aqui');
            console.log(JSON.stringify(err));
        } else {
            console.log('informacion obtenida');
            console.log(JSON.parse(data));
        }
    })
});

app.get('/instagram/logout', () => {});



app.listen(port, () => {
    console.log(`
                                        Server on port in ${ port }
                                        `);
});