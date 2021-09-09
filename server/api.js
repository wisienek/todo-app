const express = require('express');
const Router = express.Router();

// require paths
const post = require('./api/post');

// Route paths
Router.use('/post', post);

// export
module.exports = Router;