var express = require('express');
var router = express.Router();

const indexController = require('../controllers/energetic-Audit-Controller');
/* GET home page. */
router.get('/', indexController.sendHTMLfile);

module.exports = router;
