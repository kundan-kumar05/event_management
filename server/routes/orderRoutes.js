const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);

router.post('/', authorize('user'), placeOrder);
router.get('/my', authorize('user'), getMyOrders);
router.get('/:id', getOrderById);
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
