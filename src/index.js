const express = require('express');
const dotenv = require('dotenv').config();
const Instagram = require('node-instagram').default;
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const engine = require('ejs-mate');
const axios = require('axios').default;
const { getUserIntagram } = require('./utils/Instagram_api');
const { token } = require('morgan');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');



//config 
const port = process.env.PORT || 3001;
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(session({ secret: 'mysecretword', signed: true }));

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
            scope: [
                'email',
                'user_profile',
                'user_photos',
                'instagram_basic',
                'instagram_graph_user_profile',
                'instagram_graph_user_media'
            ]
        })
    );

});

//ruta de callback of instagram 
app.get('/instagram/callback', async(req, res) => {
    console.log('iniciando session en instagram');

    try {
        const code = req.query.code;
        const data = await instagram.authorizeUser(code, process.env.IG_URI_REDIRECT);

        localStorage.setItem('token', data.access_token);
        console.log('token: ' + data.access_token);
        localStorage.setItem('user_id', data.user_id);
        console.log('user_id: ' + data.user_id);

        res.redirect('/instagram/home');
    } catch (err) {
        res.json(err.message);
    }
});



//ruta de profile
app.get('/instagram/profile', (req, res) => {

    const Token = localStorage.getItem('token');
    // const UserId = localStorage.getItem('user_id');
    // console.log('token: ' + Token);
    // console.log('user_id: ' + UserId);


    axios.get('https://graph.instagram.com/me?fields=id,account_type,media_count,username&access_token=' + Token)
        .then(result => { return res.render('profile', { perfil: result.data }) })
        .catch(err => { res.json(err.message) });

});

app.get('/instagram/home', (req, res) => {

    res.render('home');

});


app.get('/instagram/media', (req, res) => {
    const Token = localStorage.getItem('token');
    axios.get('https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=' + Token)
        .then(response => {})
        .catch(err => {});

});

app.get('/instagram/logout', () => {});

//axios 
// axios.post(`https://api.instagram.com/oauth/access_token?client_id=${process.env.IG_CLIENT_ID}&client_secret=${process.env.IG_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${process.env.IG_URI_REDIRECT}&code=${code}`)
//     .then(response => {
//         res.json(response.data);
//     })
//     .catch(err => {
//         console.log(err);
//     });
// axios.get(`https://api.instagram.com/oauth/authorize?client_id=${process.env.IG_CLIENT_ID}&redirect_uri=${process.env.IG_URI_REDIRECT}&scope=user_profile,instagram_graph_user_profile,instagram_graph_user_media&response_type=code`)
// .then(response => {
//     console.log(response.config.transformResponse);
//     res.redirect(process.env.IG_URI_REDIRECT);
// }).catch(err => { console.log(err) });
// const getUser = request('https://graph.instagram.com/me?fields=id,username&access_token=' + Token, { json: true },
//     (err, result, body) => {
//         if (err) { return console.log(err.message); }
//         return result.body;
//     }
// );
//peticion para obtener las fotos
// axios.get('https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=' + Token)
//     .then(response => {
//         console.log(response.data);
//         return res.json(response.data);
//     })
//     .catch(err => { console.log(err.message); });




app.listen(port, () => {
    console.log(`
                                        Server on port in ${ port }
                                        `);
});