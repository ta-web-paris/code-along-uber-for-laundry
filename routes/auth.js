const express = require('express');
const passport = require('passport');
const router = express.Router();

const { ensureLoggedIn, ensureLoggedOut } = require('../middlewares/auth');

router.get('/signup', ensureLoggedOut, (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: req.flash('error'),
  });
});

router.get('/login', ensureLoggedOut, (req, res, next) => {
  res.render('auth/login', {
    errorMessage: req.flash('error'),
  });
});

router.get('/logout', ensureLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

router.post(
  '/signup',
  passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true,
  })
);

router.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

module.exports = router;
