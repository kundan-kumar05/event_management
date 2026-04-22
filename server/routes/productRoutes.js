const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProducts, getAllProducts, getMyProducts, getProductById,
  addProduct, updateProduct, approveProduct, deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin
router.get('/admin/all', protect, authorize('admin'), getAllProducts);
router.put('/:id/approve', protect, authorize('admin'), approveProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

// Vendor
router.get('/vendor/my', protect, authorize('vendor'), getMyProducts);
router.post('/', protect, authorize('vendor'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description').notEmpty().withMessage('Description is required'),
], addProduct);
router.put('/:id', protect, authorize('vendor'), updateProduct);

module.exports = router;
