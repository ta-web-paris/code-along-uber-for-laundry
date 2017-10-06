const express = require('express');
const router = express.Router();
const User = require('../models/user');
const LaundryPickup = require('../models/laundry-pickup');

const { ensureLoggedIn } = require('../middlewares/auth');

router.post('/:id/pickups', ensureLoggedIn, (req, res, next) => {
  const pickup = new LaundryPickup({
    date: req.body.date,
    user: req.user._id,
    launderer: req.params.id,
  });

  pickup.save(err => {
    if (err) return next(err);
    res.redirect('/dashboard');
  });
});

module.exports = router;
