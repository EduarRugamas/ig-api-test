const axios = require('axios').default;
const config = require('../config/config');
const localStorage = require('localStorage');



const getInformationUser = async function (req, res) {
    const token = localStorage.getItem('access_token');
    console.log('token obtenido' + token);

    const result = await axios.get('https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=' + token, {headers: { 'Content-type': 'application/json ' }});

    res.send(result);
};


module.exports = {
    getInformationUser
}
