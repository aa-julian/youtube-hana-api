'use strict';

//NPM Packages
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');
const express = require('express');
const xsenv = require('@sap/xsenv');
const hdbext = require('@sap/hdbext');

let app = express();

app.use(morgan('combined'));
app.use(bodyParser.json({ extended: true }));
app.use(compression());

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// inject hana connection info each route
const services = xsenv.getServices({ hana: { tag: 'hana' } }, '/tmp/default-services.json');
app.use('/', hdbext.middleware(services.hana));

// configure routes
const indexCtrl = require('./controllers/index');
const infoCtrl = require('./controllers/dbInfo');
const searchCtrl = require('./controllers/newSearch');
const videoCtrl = require('./controllers/videoData');


const router = express.Router();
router.route('').get(indexCtrl);
router.route('/dbInfoGet').get(infoCtrl);
router.route('/videoDataGet').get(videoCtrl);
router.route('/newVideoData').get(searchCtrl);



app.use('/', router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`http server started on port ${port}`);
});