const axios = require('axios').default;
const config = require('../config/config');
const localStorage = require('localStorage');



const getInformationMedia = async (req, res) => {
    const token = localStorage.getItem('access_token');
    const user_id = localStorage.getItem('user_id');
    console.log('user_id: ' + user_id);
    console.log('token obtenido: ' + token);

    try {
        await axios.get('https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=' + token)
            .then(response => {res.json(response.data);})
            .catch(error => {res.json(error);})

    }catch (e) {
        res.json(e.message);
    }

};


module.exports = {
    getInformationMedia
}
