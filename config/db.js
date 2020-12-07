var mysql = require('mysql');
let connection = mysql.createConnection({
    host: "localhost",
    port: '3306',
    database: 'osiz_tech',
    user: 'root',
    password: '',
    multipleStatements: true
});

module.exports = connection;


