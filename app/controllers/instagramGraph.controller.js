const axios = require('axios').default;
const config = require('../config/config');
const localStorage = require('localStorage');



const getInformationMedia = async (req, res) => {
    const token = localStorage.getItem('access_token');
    const user_id = localStorage.getItem('user_id');
    console.log('user_id: ' + user_id);
    console.log('token obtenido: ' + token);

    try {
        const result = await axios.get('https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=' + token)
        console.log(result.data);
        res.json(result.data);
    }catch (e) {
        res.json(e.message);
    }

};

const getInformatioUser = async (req, res) => {
    const token = localStorage.getItem('access_token');

        await axios.get('https://graph.instagram.com/me?fields=account_type,id,username,media_count&access_token=' + token)
            .then(response => {
                console.log("User information");
                console.log(response.data);
                res.json(response.data);
        }).catch(error => {

        });

};


module.exports = {
    getInformationMedia,
    getInformatioUser
}
