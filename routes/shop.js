import express from 'express';

import {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteItem,
  getOrders,
  postOrder,
  getCheckout,
} from '../controllers/shop.js';

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:product_id', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.post('/cart-delete-item', postCartDeleteItem);

router.get('/orders', getOrders);

router.post('/create-order', postOrder);

router.get('/checkout', getCheckout);

export default router;
