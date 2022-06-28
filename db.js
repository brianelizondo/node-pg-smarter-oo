/** Database for lunchly */

const { Client } = require("pg");

let db = new Client({
    user: 'brian',
    password: '123456',
    database: 'lunchly'
  });

db.connect();

module.exports = db;