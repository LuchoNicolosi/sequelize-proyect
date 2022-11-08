import Sequelize from 'sequelize';

const sequelize = new Sequelize('node-complete', 'root', 'mysql', {
  dialect: 'mysql', //especifico que es una db mysql
  host: 'localhost',
});

export default sequelize;

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete', // Aca se pone el nombre de la schema que quiera usar de mysql
//   password: 'mysql',
// });

// module.exports = pool.promise();
