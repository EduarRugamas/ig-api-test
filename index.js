const express = require('express');
const dotenv = require('dotenv').config();
const Instagram = require('node-instagram').default;
const path = require('path');
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


    try {
        const code = req.query.code;
        const data = await instagram.authorizeUser(code, process.env.IG_URI_REDIRECT);
        console.log('token: ' + data.access_token);
        //token a guardar en localstorage
        localStorage.setItem('token_ig', data.access_token);
        // res.json(data);
        res.redirect('/instagram/profile')
    } catch (e) {
        res.json(e)
    }


    // const data = await instagram.authorizeUser(req.query.code, process.env.IG_URI_REDIRECT, (err, result) => {
    //     if (err) return res.send(err);
    //     //guardando token en una cookie del navegador
    //     res.cookie('igToken', result.access_token);
    //     //imprimo la cookie para saber el valor 
    //     console.log(` token guardado ${result.access_token}`);
    //     //redirecciono a una ruta para mostrar las fotos del usuario logeado 
    //     res.redirect('/instagram/photos');
    // });

});



//ruta de photos
app.get('/instagram/profile', (req, res) => {

    const token = localStorage.getItem('token_ig');
    instagram.get('users/self', { access_token: token }, (err, data) => {
        if (err) return res.render('error');
        console.log(data);
        res.render('profile', {
            datos: data
        });
    });


});




app.listen(port, () => {
    console.log(`
                                        Server on port in ${ port }
                                        `);
});