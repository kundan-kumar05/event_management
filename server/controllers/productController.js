const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Get all approved products
// @route   GET /api/products
// @access  Public / User
const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = { status: 'approved' };

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(query)
      .populate('vendorId', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({ success: true, products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all products (Admin — all statuses)
// @route   GET /api/products/all
// @access  Admin
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('vendorId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get vendor's own products
// @route   GET /api/products/my
// @access  Vendor
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendorId', 'name email');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add product (Vendor)
// @route   POST /api/products
// @access  Vendor
const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { name, price, category, description, stock } = req.body;
    const product = await Product.create({
      name, price, category, description, stock,
      vendorId: req.user._id,
      status: 'approved',
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Vendor — own products only)
// @route   PUT /api/products/:id
// @access  Vendor
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const { name, price, category, description, stock } = req.body;
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category, description, stock, status: 'approved' },
      { new: true, runValidators: true }
    );
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve / Reject product (Admin)
// @route   PUT /api/products/:id/approve
// @access  Admin
const approveProduct = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getAllProducts, getMyProducts, getProductById, addProduct, updateProduct, approveProduct, deleteProduct };
