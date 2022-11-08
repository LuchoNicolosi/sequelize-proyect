// const Cart = require('../models/cart');
import Product from '../models/product.js';

export const getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getProduct = (req, res, next) => {
  const prod_id = req.params.product_id;
  Product.findByPk(prod_id)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        path: '/products',
        pageTitle: product.title,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postCart = (req, res, next) => {
  const prodId = req.body.product_id;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        //Aca existe el producto
        //Necesito saber mi cantidad anterior para actualizarlo
        const oldQuantity = product.cartItem.quantity; //Sequelize me provee esto, crea un objeto del producto, el cartItem con sus campos (locura)
        newQuantity = oldQuantity + 1;
        return product;
      }
      //En este caso, no existe el producto en el carrito, entonces lo añado
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postCartDeleteItem = (req, res, next) => {
  // Obtener el Id del item que quiero eliminar
  const prodId = req.body.product_id;
  req.user
    .getCart() //Traeme el carrito
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } }); //Quiero los productos que tengan este productId
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy(); //Elimino esa vinculacion de carrito/producto en cartItem
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

export const getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] }) //Le digo a sequelize. Si estoy recuperando las ordenes, tambien recuperame todos los productos relacionados a ella, y retorname un array de ordenes donde incluya los products por order, ESTO FUNCIONA PORQUE TENGO UNA RELACION ENTRE ORDER - PRODUCT
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

export const postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart() //Me traigo mi carrito actual
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts(); //Me traigo todos los productos
    })
    .then((products) => {
      return req.user //Luego, creo una orden
        .createOrder()
        .then((order) => {
          return order.addProducts(
            // Añado los productos en el orderItem peeero
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity }; //En cada orderItem, quiero almacenar la cantidad que tengo en el cartItem
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then(() => fetchedCart.setProducts(null))
    .then(() => res.redirect('/orders'))
    .catch((err) => console.log(err));
};

export const getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
