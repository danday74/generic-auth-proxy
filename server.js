const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const router = express.Router();
const config = require('./server.config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(require('./middlewares/1-request-logger'));

require('./routes/bible/bible')(router);

app.use('/', router);
app.listen(config.port, () => {
  /* istanbul ignore next */
  config.logging && console.log('Express backend server listening on port', config.port);
});

module.exports = app;
