const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const laundryPickupSchema = new Schema({
  date: { type: Date, required: true },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  launderer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

laundryPickupSchema.set('timestamps', true);

module.exports = mongoose.model('LaundryPickup', laundryPickupSchema);
