const express = require('express');
const passport = require('passport');
const router = express.Router();

/* GET home page. */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: req.flash('error'),
  });
});

router.post(
  '/signup',
  passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true,
  })
);

module.exports = router;
