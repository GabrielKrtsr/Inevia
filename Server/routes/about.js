var express = require('express');
var router = express.Router();

const indexController = require('../controllers/AboutController');
/* GET home page. */
router.get('/', indexController.sendHTMLfile);

module.exports = router;
