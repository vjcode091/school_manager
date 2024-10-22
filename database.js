const mysql = require('mysql2');
let database = mysql.createConnection({
    port: '3306',
    host: 'sql5.freesqldatabase.com',
    user: 'sql5738003',
    password: 'AdPHG5uxnD',
    database: 'sql5738003'
})

database.connect((err)=>{
    if (err){
        throw err;
    }else{
        console.log('database running')
    }
})

module.exports = database;