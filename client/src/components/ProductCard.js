import React from 'react';
import { addToCart } from '../services/orderService';

const CATEGORY_ICONS = {
  Electronics: '💻', Clothing: '👕', Food: '🍔',
  Books: '📚', Home: '🏠', Sports: '⚽', Other: '📦',
};

const ProductCard = ({ product, showActions = true, onAdded }) => {
  const [adding, setAdding] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      if (onAdded) onAdded();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card animate-in">
      <div className="product-card-img">
        {CATEGORY_ICONS[product.category] || '📦'}
      </div>
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <div className="product-card-name">{product.name}</div>
        <p className="text-muted text-sm" style={{ lineHeight: '1.5' }}>
          {product.description?.substring(0, 80)}{product.description?.length > 80 ? '…' : ''}
        </p>
        {product.vendorId?.name && (
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>by {product.vendorId.name}</div>
        )}
        <div className="product-card-price">₹{product.price?.toLocaleString()}</div>
      </div>
      {showActions && (
        <div className="product-card-footer">
          <button
            className={`btn btn-block ${added ? 'btn-success' : 'btn-primary'}`}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? '…' : added ? '✓ Added!' : '🛒 Add to Cart'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
