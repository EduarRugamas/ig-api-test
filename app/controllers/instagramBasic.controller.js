const Instagram = require('node-instagram').default;
const config = require('../../app/config/config');


const instagram = new Instagram({
    clientId: config.ig_client_id,
    clientSecret: config.ig_client_secret,
});



const Authorization = (req, res) => {
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
    Authorization,
    userAuthorization
}