var express = require('express');
var router = express.Router();
var fs = require('fs');
var auth = require('basic-auth');
const path = require('path');

const configFilename = 'recom_en.json';

router.get('/config', function(req, res, next) {
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
    fs.readFile(path.join(baseDir, 'public', configFilename), function (err, data) {
      if (err) {
        res.status(500).send('Failed to load configuration.');
      } else {
        let parsedData = JSON.parse(data);
        res.json(parsedData);
      }
    });
  }
});

router.post('/config', function(req, res, next) {
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
    fs.writeFile(path.join(baseDir, 'public', configFilename), JSON.stringify(req.body, null, 2), function(err) {
      if (err) {
        console.error('Error: ' + err);
        res.status(500).send('Failed to save configuration.');
      } else {
        res.status(200).send('OK');
      }
    });
  }
});

module.exports = router;
