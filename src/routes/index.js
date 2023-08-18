const express = require('express');
const books = require('./books');
const Router = express.Router();

Router.use('/books/', books);

module.exports = Router;