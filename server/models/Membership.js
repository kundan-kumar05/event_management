const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    duration: {
      type: String,
      enum: ['6m', '1y', '2y'],
      default: '6m',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    plan: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      default: 'basic',
    },
  },
  { timestamps: true }
);

// Helper to compute endDate from duration string
membershipSchema.statics.computeEndDate = function (startDate, duration) {
  const d = new Date(startDate);
  if (duration === '6m') d.setMonth(d.getMonth() + 6);
  else if (duration === '1y') d.setFullYear(d.getFullYear() + 1);
  else if (duration === '2y') d.setFullYear(d.getFullYear() + 2);
  return d;
};

module.exports = mongoose.model('Membership', membershipSchema);
