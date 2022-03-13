var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { create } = require( 'express-handlebars' );
var dateFormat = require( 'handlebars-dateformat' );
var session = require( 'express-session' );
const MongoStore = require('connect-mongo')
var db = require('./config/connection')
var fileUpload = require('express-fileupload')
var Promise = require('promise')
const bodyParser = require('body-parser')
const fs = require('fs')

var indexRouter = require('./routes/index');
var u_loginRouter = require('./routes/user/login');
var u_signupRouter = require('./routes/user/signup');
var a_loginRouter = require('./routes/admin/login');
var u_otpRouter = require('./routes/user/otp')
var a_indexRouter = require('./routes/admin/home')
var a_otpRouter = require('./routes/admin/otp')
var a_productRouter = require('./routes/admin/product')


var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const hbs = create({
  layoutsDir: `${__dirname}/views/layouts`,
  extname : 'hbs',
  defaultLayout: 'layout',
  partialsDir: `${__dirname}/views/partials`,
  helpers:{
    'dateFormat' : dateFormat
  }
});
app.engine('hbs', hbs.engine);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 
// app.use(session({secret: "Key",
//  cookie: {maxAge: 6000000},
//  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/test-app' })
// }))

app.use(session({secret:"key", 
resave: true,
saveUninitialized: true,
cookie:{maxAge:6000000}}))
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});


app.use(fileUpload())

app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});


app.use('/', indexRouter);
app.use('/u-login', u_loginRouter);
app.use('/u-signup', u_signupRouter);
app.use('/u-otp', u_otpRouter)
app.use('/a-home', a_indexRouter)
app.use('/a-login', a_loginRouter)
app.use('/a-otp', a_otpRouter)
app.use('/a-product',a_productRouter)



db.connect((err) => {
  if (err) {
    console.log('Connection Error : ' + err)
  } else {
  console.log('Database Connected to PORT 27017')
  }
})

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
  res.render('admin/errorPage', {errorPartial : true});
});

module.exports = app;
