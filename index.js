const express = require('express');
const config = require('./app/config/config');
const routes = require('./app/routes');
const engine = require('ejs-mate');
const morgan = require('morgan');
const path = require("path");
const axios = require('axios').default;
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');



//config
const port = config.port || 3001;
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config ejs and cookieParser
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
    // app.use(cookieParser());

//ruta raiz
// app.get('/', (req, res) => {
//     res.render('index');
// });

//ruta login
// app.get('/login', (req, res) => {
//     res.redirect('/instagram/authorize');
// });



//ruta de callback of instagram
// app.get('/instagram/callback', async(req, res) => {
//     //esta es la ruta donde se obtiene el code de la redireccion de instagram
//     //guardo el token y user_id
//     //esto lo hago con la lib de node-instagram
//     console.log('iniciando session en instagram');
//     //aqui ya obteniendo el token y el user_id para poder usarlo en las demas peticiones que se necesitan realizar
//     try {
//         const code = req.query.code;
//         const data = await instagram.authorizeUser(code, process.env.IG_URI_REDIRECT);

//         localStorage.setItem('token', data.access_token);
//         localStorage.setItem('user_id', data.user_id);
//         console.log('token: ' + data.access_token);
//         console.log('user_id: ' + data.user_id);
//         //aqui redirecciono a una ruta aparte aun que se puede hacer mas directo solo es de cambiarlos aqui
//         res.redirect('/instagram/home');
//     } catch (err) {
//         res.json(err.message);
//     }
// });



//ruta de profile
// app.get('/instagram/profile', (req, res) => {

//     //esta ruta obtengo la informacion del perfil del usuario de instagram
//     //como el username, el id de la cuenta de instagram, el tipo de cuenta etc.

//     const Token = localStorage.getItem('token');
//     // const UserId = localStorage.getItem('user_id');
//     // console.log('token: ' + Token);
//     // console.log('user_id: ' + UserId);

//     //aqui con axios realizo la peticion a la ruta de la api de instagram aqui se maneja manualmente
//     //y paso esa informacion a una vista de ejs
//     axios.get('https://graph.instagram.com/me?fields=id,account_type,media_count,username&access_token=' + Token)
//         .then(result => { return res.render('profile', { perfil: result.data }) })
//         .catch(err => { res.json(err.message), console.log('error aqui:' + err.message); });

// });

// app.get('/instagram/home', (req, res) => {

//     res.render('home');

// });


// app.get('/instagram/media', (req, res) => {

//     //aqui en esta ruta es donde se obtiene la informacion de media o los datos de las imagenes, videos o albumnes de instagram
//     //la peticion cambia segun lo que quieras obtener asi tambien se pueden obtener campos especificos, eso se configura en los fiels de la peticion
//     // de igual manera se esta manejando con axios y aqui se usa el token obtenido cuando se hace el cambio del code por el token
//     // de igual manera le paso la informacion en una variable a una plantilla de ejs
//     const Token = localStorage.getItem('token');
//     axios.get('https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=' + Token)
//         .then(response => { return res.render('media', { user_media: response.data.data }); })
//         .catch(err => { return res.json(err.message), console.log('error aqui:' + err.message); });

// });

//y asi esta compuesta la logica con la api de instagram
//cualquier consulta y algo que hay que mejorar me avisas manguito1

// app.get('/instagram/logout', () => {});

if (config.env === 'production') {
    app.use('/', routes);
} else if (config.env === 'development') {
    app.use('/', routes);
}


app.listen(config.port, () => {
    console.log(`Server on port in ${port}`);
});
