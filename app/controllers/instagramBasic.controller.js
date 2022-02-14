const Instagram = require('node-instagram').default;
const config = require('../../app/config/config');
const localStorage = require('localStorage');
const axios = require('axios').default;


const instagram = new Instagram({
    clientId: config.ig_client_id,
    clientSecret: config.ig_client_secret,
});


const index = (req, res) => {
    res.render('index');
}

const authorizationWithAxios = (req, res) => {
    axios.get('https://api.instagram.com/oauth/authorize?client_id='+ config.ig_client_id + '&redirect_uri='+config.ig_uri_redirect + '&scope=email,user_profile,user_photos,instagram_basic,instagram_graph_user_profile,instagram_graph_user_media&response_type=code').then(response => {
        console.log(response.data);
        return response.data;
    }).catch( error => {
        res.json(error.message);
    } );
};

const authorization = (req, res) => {
    res.redirect(
        instagram.getAuthorizationUrl(config.ig_uri_redirect, {
            scope: [
                'email',
                'user_profile',
                'user_photos',
                'instagram_basic',
                'instagram_graph_user_profile',
                'instagram_graph_user_media'
            ],
            state: '1'
        })
    );
};

const userAuthorization = async(req, res) => {
    try {
        const code = req.query.code;
        const data = await instagram.authorizeUser(code, config.ig_uri_redirect);
        return res.json(data);
    } catch (error) {
        res.json(error.message);
    }

};


module.exports = {
    authorization,
    authorizationWithAxios,
    userAuthorization,
    index
}
