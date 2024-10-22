const express = require('express');
const database = require('../database.js');
const crypto = require('crypto');

const router = express.Router();

router.get('/', (req, res)=>{
    res.render('token', {
        title: 'Digital Card'
    })
})

router.post('/generate-token', (req, res)=>{
    const token = crypto.randomBytes(4).toString('hex');//generate random token
    const amount = req.body.amount;
    const student_id = req.body.student_id;

    //INSERT TOKEN into MySql db
    const query = `INSERT INTO tokens (token, amount, student_id) VALUES (?, ?, ?)`;
    database.query(query, [token, amount, student_id], (err, result)=>{
        if (err) throw err;
        const tokenData = result[0];
        res.send(`<div>
            <p>you token is: ${token}</p>
            <a href="/"><button>Done</button></a>
            </div>`)
    })
})

//Generate token into the Mysql db


module.exports = router;