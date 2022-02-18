const Instagram = require('node-instagram').default;
const config = require('../../app/config/config');
const localStorage = require('localStorage');
const open = require('open');
const axios = require('axios').default;


const instagram = new Instagram({
    clientId: config.ig_client_id,
    clientSecret: config.ig_client_secret,
});

const url = 'https://api.instagram.com/oauth/authorize?client_id=' + config.ig_client_id + '&redirect_uri=' + config.ig_uri_redirect + '&scope=email,user_profile,user_photos,instagram_basic,instagram_graph_user_profile,instagram_graph_user_media&response_type=code';

const index = (req, res) => {
    res.render('index');
}

const authorizationWithAxios = (req, res) => {
    open(url)
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
                'instagram_graph_user_media',
                'business_management'
            ],
            state: '1'
        })
    );
};

// const userAuthorizationWithAxios = async (req, res) => {
//     const code = req.query.code;
//     try {
//         const response = await axios.post('https://api.instagram.com/oauth/access_token?client_id='+ config.ig_client_id+'&client_secret='+config.ig_client_secret+'&grant_type=authorization_code&redirect_uri='+config.ig_uri_redirect+'&code='+code);
//         console.log(response);
//         res.json(response);
//     }catch (e) {
//         res.json(e)
//     }
//
// };

const userAuthorization = async (req, res) => {
    try {
        const code = req.query.code;
        const data = await instagram.authorizeUser(code, config.ig_uri_redirect);

        if (data.access_token === undefined ){
            res.json({
                message: 'No existe token de accesso'
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
    authorizationWithAxios,
    index
}
