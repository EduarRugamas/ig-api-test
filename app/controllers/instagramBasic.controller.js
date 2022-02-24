const Instagram = require('node-instagram').default;
const config = require('../../app/config/config');
const localStorage = require('localStorage');
const isArray = require('lodash/isArray');
const axios = require('axios').default;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const instagram = new Instagram({
    clientId: config.ig_client_id,
    clientSecret: config.ig_client_secret,
});


const index = (req, res) => {
    res.render('index');
}

 function authorizationUrl(permisions) {
    let authorizationUri = `https://api.instagram.com/oauth/authorize/?client_id=${config.ig_client_id}&redirect_uri=${config.ig_uri_redirect}&response_type=code`;

    if(permisions.scope){
        if (isArray(permisions.scope)){
           permisions.scope = permisions.scope.join('+');
        }
        authorizationUri += `&scope=${permisions.scope}`;
    }
    if (permisions.state){
        authorizationUri += `&state=${permisions.state}`
    }
    return authorizationUri;
}

const authorization = (req, res) => {
    res.redirect(
        authorizationUrl(
            {
            scope: [
            'email',
            'user_profile',
            'user_photos',
            'instagram_basic',
            'instagram_graph_user_profile',
            'instagram_graph_user_media'
            ]}
        )
    );
};


const userAuthorizationWithAxios = async (req, res) => {
    const code = req.query.code;

    try{

        const body = {
            code: code,
            redirect_uri: config.ig_uri_redirect,
            client_id: config.ig_client_id,
            client_secret: config.ig_client_secret,
            grant_type: 'authorization_code'
        }

        const response = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        });
        const data = await response.json();


        res.json(data);
    }catch (e) {
        res.json(e.message);
    }

}

const userAuthorization = async (req, res) => {
    try {
        const code = req.query.code;
        const data = await instagram.authorizeUser(code, config.ig_uri_redirect);

        if (data.access_token === undefined ){
            res.json({
                message: 'No existe token de access'
            });
        }else if (data.user_id === undefined){
            res.json({
                message: 'No existe user_id'
            });
        }
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_id', data.user_id);
        // console.log('token: ' + data.access_token);
        // console.log('user_id: ' + data.user_id);
        // res.json
        res.render('home')
    } catch (error) {
        res.json(error.message);
    }

};


module.exports = {
    authorization,
    userAuthorization,
    userAuthorizationWithAxios,
    index
}
