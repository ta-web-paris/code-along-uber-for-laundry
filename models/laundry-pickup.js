const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const STATUSES = ['waiting', 'accepted', 'refused', 'done'];

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
  status: {
    type: String,
    enum: STATUSES,
    default: 'waiting',
  },
});

laundryPickupSchema.set('timestamps', true);

module.exports = mongoose.model('LaundryPickup', laundryPickupSchema);
