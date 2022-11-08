import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
//CONTROLLERS-ROUTES
import { getError404 } from './controllers/404.js';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';

// const path = require('path');
// const express = require('express');
const app = express();
const port = 3000;

// const bodyParser = require('body-parser');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Database
import sequelize from './util/db.js';

//Models
import Product from './models/product.js';
import User from './models/user.js';
import Cart from './models/cart.js';
import CartItem from './models/cart-item.js';
import Order from './models/order.js';
import OrderItem from './models/order-item.js';

//CONTROLLERS-ROUTES
// const error404Conroller = require('./controllers/404');
// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

//MIDDLEWARES
app.set('view engine', 'ejs'); // compilame las plantillas dinamicas con pug/ejs
app.set('views', 'views'); // y anda a buscar las plantillas a la carpeta views

app.use(bodyParser.urlencoded({ extended: false })); // no analiza todo tipo de cuerpos como ,archivos, json etc pero si analiza los cuerpos de un form

app.use(express.static(path.join(__dirname, 'public'))); //Esto me permite poder exportar la carpeta public,asi puedo usar css

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes); //solo las rutas que comiencen con /admin entraran en el archivo adminRoutes
app.use(shopRoutes);

app.use(getError404);

//RELACIONES
//-------------------
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Order.belongsToMany(Product, { through: OrderItem });
//-------------------

sequelize
  // .sync({ force: true }) //De esta forma anula los datos almacenados
  .sync() //Basicamente crea las tablas de los modelos definidos y no sobreescribe los datos, sincroniza los modelos a la db
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Lucho', email: 'test@gmail.com' });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    app.listen(port, () => {
      console.log(`Server corriendo en el puerto ${port} con exito!`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
