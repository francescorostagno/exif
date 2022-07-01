const express = require('express');
const router = express.Router();
const exif = require('exif-parser')
const fs = require('fs')
/* GET users listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});

module.exports = router;
