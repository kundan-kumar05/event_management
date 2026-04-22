const express = require('express');
const router = express.Router();
const { addMembership, updateMembership, getMyMembership, getAllMemberships } = require('../controllers/membershipController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);

router.post('/add', addMembership);
router.put('/update', updateMembership);
router.get('/my', getMyMembership);
router.get('/', authorize('admin'), getAllMemberships);

module.exports = router;
