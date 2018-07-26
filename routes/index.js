var express = require('express');
var router = express.Router();
var auth = require('basic-auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  let credentials = auth(req);

  if (!credentials || 
      !process.env.adminUsername || 
      !process.env.adminPassword || 
      credentials.name !== process.env.adminUsername || 
      credentials.pass !== process.env.adminPassword) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Access to Best Bets configuration"');
    res.end('Access denied');
  } else {
    res.render('index', { title: 'Best Bets Config' });
  }
});

module.exports = router;