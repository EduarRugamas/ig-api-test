const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });


const esquemaVariables = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development').required(),
        PORT: Joi.number().default(3000),
        IG_CLIENT_ID: Joi.string().required().description('id de cliente de app de instagram'),
        IG_CLIENT_SECRET: Joi.string().required().description('id cliente secret de instagram'),
        IG_URI_REDIRECT: Joi.string().required().description('uri de redireccion de instagram')
    }).unknown();


const { value: varsEnv, error } = esquemaVariables.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    console.log(`Hay un error en las archivo config.js ->: ${error.message}`);
}

module.exports = {
    env: varsEnv.NODE_ENV,
    port: varsEnv.PORT,
    ig_client_id: varsEnv.IG_CLIENT_ID,
    ig_client_secret: varsEnv.IG_CLIENT_SECRET,
    ig_uri_redirect: varsEnv.IG_URI_REDIRECT

}