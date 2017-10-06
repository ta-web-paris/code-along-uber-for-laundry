const express = require('express');
const router = express.Router();
const User = require('../models/user');

const { ensureLoggedIn, ensureLoggedOut } = require('../middlewares/auth');

router.get('/', ensureLoggedIn, (req, res) => {
  User.find(
    {
      isLaunderer: true,
    },
    (err, launderers) => {
      if (err) return next(err);
      res.render('laundry/launderers', {
        launderers: launderers,
      });
    }
  );
});

module.exports = router;
