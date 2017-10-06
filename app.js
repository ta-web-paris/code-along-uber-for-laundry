const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost/uber-laundry', {
  useMongoClient: true,
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);
app.locals.title = 'Uber for Laundry';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'uber-laundry',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(flash());

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

// Signing Up
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: 'email',
    },
    (req, email, password, next) => {
      // To avoid race conditions
      process.nextTick(() => {
        // Destructure the body
        const { name } = req.body;
        const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        const user = new User({
          name,
          email,
          password: hashPass,
        });

        user.save(err => {
          if (err) {
            // duplicated email
            if (err.code === 11000) {
              return next(null, false, {
                message: `email ${email} is already used`,
              });
            }
          }
          next(err, user);
        });
      });
    }
  )
);

passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    (email, password, next) => {
      User.findOne({ email }, (err, user) => {
        if (err) return next(err);
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return next(null, false, { message: 'Email and password do not match' });
        }

        return next(null, user);
      });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index');
const authController = require('./routes/auth');
const laundryController = require('./routes/laundry');
const pickupController = require('./routes/laundry-pickup');

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', index);
app.use('/', authController);
app.use('/launderers', laundryController);
app.use('/launderers', pickupController);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
