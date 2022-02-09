const express = require('express');
const dotenv = require('dotenv').config();
const Instagram = require('node-instagram').default;
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const engine = require('ejs-mate');
const axios = require('axios').default;
const request = require('request');
const LocalStorage = require('node-localstorage').LocalStorage;

const localStorage = new LocalStorage('./scratch');



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
    const code = req.query.code;
    const data = await instagram.authorizeUser(code, process.env.IG_URI_REDIRECT);

    localStorage.setItem('token', data.access_token);
    console.log('token: ' + data.access_token);
    localStorage.setItem('user_id', data.user_id);
    console.log('user_id: ' + data.user_id);

    res.render('profile');
});



//ruta de profile
app.get('/instagram/profile', (req, res) => {

    const Token = localStorage.getItem('token');
    const UserId = localStorage.getItem('user_id');
    console.log('token: ' + Token);
    console.log('user_id: ' + UserId);

    request('https://graph.instagram.com/' + UserId + '?fields=id,username&access_token=' + Token, { json: true },
        (err, result, body) => {
            if (err) { return console.log(err.message); }

            console.log(body.url);
            console.log(body.explanation);
        }
    );

    // axios.get(`https://graph.instagram.com/${UserId}?fields=id,username&access_token=${Token}`)
    //     .then(response => { console.log(response.data); })
    //     .catch(err => { console.log(err.message); });

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




app.listen(port, () => {
    console.log(`
                                        Server on port in ${ port }
                                        `);
});