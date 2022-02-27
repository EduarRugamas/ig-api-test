const express = require('express');
const config = require('./app/config/config');
const routes = require('./app/routes');
const morgan = require('morgan');
const engine = require('ejs-mate');
const path = require("path");

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


if (config.env === 'production') {
    app.use('/', routes);
} else if (config.env === 'development') {
    app.use('/', routes);
}


app.listen(config.port, () => {
    console.log(`Server on port in ${port}`);
});
