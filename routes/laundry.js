const express = require('express');
const router = express.Router();
const User = require('../models/user');

const { ensureLoggedIn, ensureLoggedOut } = require('../middlewares/auth');

router.get('/', ensureLoggedIn, (req, res, next) => {
  User.find(
    {
      isLaunderer: true,
    },
    (err, launderers) => {
      if (err) return next(err);
      res.render('laundry/launderers', {
        launderers: launderers,
        errorMessage: req.flash('error'),
      });
    }
  );
});

router.get('/:id', ensureLoggedIn, (req, res, next) => {
  User.findOne(
    {
      _id: req.params.id,
      isLaunderer: true,
    },
    (err, launderer) => {
      if (err || !launderer) {
        req.flash('error', `There's no launderer with id ${req.params.id}`);
        return res.redirect('/launderers');
      }
      res.render('laundry/launderer-profile', {
        launderer: launderer,
      });
    }
  );
});

router.post('/', ensureLoggedIn, (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      fee: req.body.fee,
    },
    err => {
      if (err) return next(err);
      res.redirect('/dashboard');
    }
  );
});

module.exports = router;
