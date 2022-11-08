import { where } from 'sequelize';
import Product from '../models/product.js';

export const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; // Esto devuleve true o undefined/false
  if (!editMode) {
    return res.redirect('/');
  }
  // •	El ID
  const prodId = req.params.product_id;
  req.user
    .getProducts({ where: { id: prodId } }) //Funcion que provee sequelize
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0]; //Aunque sea un producto, esta funcion devuelve un array siempre
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // •	La información que quiero editar del producto en lugar de crearlo
};

export const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postEditProduct = (req, res, next) => {
  //1- Buscar informacion del producto
  // const prodId =  req.params.product_id Es una post request, no se puede de esta forma
  const prodId = req.body.product_id; //Esto lo obtengo en el body del form, almacenado en un input hidden
  //2- Crear una nueva instancia de producto y llenarla con esa informacion
  const updatTitle = req.body.title;
  const updateImageUrl = req.body.imageUrl;
  const updatePrice = req.body.price;
  const updateDescription = req.body.description;
  Product.findByPk(prodId)
    .then((product) => {
      product.set({
        title: updatTitle,
        imageUrl: updateImageUrl,
        price: updatePrice,
        description: updateDescription,
      });
      //3- Save()
      return product.save(); //update database, aca retorno para poder volver a usar el then como promesa
    })
    .then(() => {
      console.log('Producto Actualizado!');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err); //este catch detectaria errores para las 2 promesas
    });
};

export const postDeleteProduct = (req, res, next) => {
  const prodId = req.body.product_id;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      console.log(`Producto con id: [${prodId}] eliminado.`);
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getProducts = (req, res, next) => {
  req.user
    .getProducts()
    // Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
