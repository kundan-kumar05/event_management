const Membership = require('../models/Membership');
const User = require('../models/User');

const addMembership = async (req, res) => {
  try {
    const { duration = '6m', plan = 'basic' } = req.body;
    const startDate = new Date();
    const endDate = Membership.computeEndDate(startDate, duration);

    const membership = await Membership.create({ userId: req.user._id, duration, plan, startDate, endDate });
    await User.findByIdAndUpdate(req.user._id, { membershipId: membership._id });

    res.status(201).json({ success: true, membership });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMembership = async (req, res) => {
  try {
    const { action, duration = '6m' } = req.body;
    const membership = await Membership.findOne({ userId: req.user._id, status: 'active' });
    if (!membership) return res.status(404).json({ success: false, message: 'No active membership found' });

    if (action === 'cancel') {
      membership.status = 'cancelled';
    } else if (action === 'extend') {
      const baseDate = membership.endDate > new Date() ? membership.endDate : new Date();
      membership.endDate = Membership.computeEndDate(baseDate, duration);
      membership.duration = duration;
    }

    await membership.save();
    res.json({ success: true, membership });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, membership });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: memberships.length, memberships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addMembership, updateMembership, getMyMembership, getAllMemberships };
