var express = require('express');
var router = express.Router();
var auth = require('basic-auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  let credentials = auth(req);

  if (!credentials || 
      !process.env.username || 
      !process.env.password || 
      credentials.name !== process.env.username || 
      credentials.pass !== process.env.password) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Access to Best Bets configuration"');
    res.end('Access denied');
  } else {
    res.render('index', { title: 'Best Bets Config' });
  }
});

module.exports = router;