const express = require('express');
const router = express.Router();
const LaundryPickup = require('../models/laundry-pickup');
const moment = require('moment');

const { ensureLoggedIn } = require('../middlewares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/dashboard', ensureLoggedIn, (req, res, next) => {
  const query = {};
  if (req.user.isLaunderer) {
    query.launderer = req.user._id;
  } else {
    query.user = req.user._id;
  }
  console.log(query);
  LaundryPickup.find(query)
    .populate('user', 'name')
    .populate('launderer', 'name')
    .sort('date')
    .exec((err, pickups) => {
      if (err) return next(err);
      res.render('laundry/dashboard', {
        pickups: pickups,
        moment: moment,
      });
    });
});

module.exports = router;
