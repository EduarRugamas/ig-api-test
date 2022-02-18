const express = require('express');
const config = require('./app/config/config');
const routes = require('./app/routes');
const engine = require('ejs-mate');
const morgan = require('morgan');
const path = require("path");
const body_parser = require('body-parser');



//config
const port = config.port || 3001;
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(body_parser.urlencoded({extended: true}));
// app.use(body_parser.json);

//config ejs and cookieParser
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
    // app.use(cookieParser());

if (config.env === 'production') {
    app.use('/', routes);
} else if (config.env === 'development') {
    app.use('/', routes);
}


app.listen(config.port, () => {
    console.log(`Server on port in ${port}`);
});
