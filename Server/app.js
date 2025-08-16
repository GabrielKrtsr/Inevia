var createError = require('http-errors');
var express = require('express');
var path = require('path');

require('dotenv').config();

var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');
var legalRouter = require('./routes/legal');
var servicesRouter = require('./routes/services');
var AuditRouter = require('./routes/energetic-audit');
var contactApiRouter = require('./routes/api/contact');

var app = express();


app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



const rateLimit = require('express-rate-limit');
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 20,
    message: { message: 'Trop de messages envoyés. Réessayez plus tard.' }
});
app.use('/api/contact', contactLimiter, contactApiRouter);




app.use('/', indexRouter);
app.use('/about',aboutRouter);
app.use('/contact', contactRouter)
app.use('/energetic-audit', AuditRouter);
app.use('/legal',legalRouter);
app.use('/services', servicesRouter)
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
res.status(err.status || 500).json({
  message: err.message,
  error: req.app.get('env') === 'development' ? err : {}
});

});

module.exports = app;