const axios = require('axios').default;
const config = require('../config/config');
const localStorage = require('localStorage');



const getInformationUser = async (req, res) => {
    const token = localStorage.getItem('access_token');
    console.log('token obtenido' + token);

    try {
        await axios.get('https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=' + token)
            .then(response => {res.json(response.data);})
            .catch(error => {res.json(error);})

    }catch (e) {
        res.json(e.message);
    }

};


module.exports = {
    getInformationUser
}
