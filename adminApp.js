const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const chance = require('chance');
const setTimeSession = 26280000000;

const router = require('./config/adminRoutes/routes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views/adminPage'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
app.set('trust proxy', 1);
app.use(session({
                  secret: "it's a secret word",
                  resave: false,
                  saveUninitialized: true,
                  cookie: { secure: false, maxAge: setTimeSession}
                }));
app.use(flash());

//set app all module
app.use(async function(req, res, next) {
  let db = require('./config/database');
  req.db = db;
  next();
})

//router
app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

console.log("Admin Page : http://localhost:4000")

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

