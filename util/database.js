// const mysql = require('mysql2');

// // Instead of creating a new connection for every operation to the database in the code, we will use a connection pool which will provide connections when needed and close them later. 

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Vkv@#$1996'
// });

// module.exports = pool.promise();

// Using Sequelize

const Sequelize = require('sequelize');

// Set up a connection pool
const sequelize = new Sequelize('node-complete','root','Vkv@#$1996', {
    dialect:'mysql',
    host: 'localhost'
});

module.exports = sequelize;