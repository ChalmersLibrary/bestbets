var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// Store the path to the directory where this file resides.
baseDir = __dirname;

// Load dev config if suitable.
if (!process.env.NODE_ENV) {
  var config = require('./config.json');
  for (var prop in config) {
      if (config.hasOwnProperty(prop)) {
          process.env[prop] = config[prop];
      }
  }
}

// Force SSL on non localhost.
function requireHTTPS(req, res, next) {
  if (req.get('x-site-deployment-id') && !req.get('x-arr-ssl')) {
      return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
app.use(requireHTTPS);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
