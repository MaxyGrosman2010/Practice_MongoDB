const express = require('express');
const router = express.Router();
const {getBooks} = require('../handlers/handler.books');

router.get(getBooks());

module.exports = router;