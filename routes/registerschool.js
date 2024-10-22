const express = require('express');
const database = require('../database.js');
const path = require('path');
const fs = require('fs')
const multer = require('multer');

const router = express.Router();

const upload = multer({storage:multer.memoryStorage()});

router.get('/', function(req, res){
    res.render('registerschool', {
        title: 'Register NOW',
        action: 'reg'
    })
})

router.post('/reg',upload.single('image'), function(req, res){
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let email = req.body.email
    let school_name = req.body.school_name
    let school_address = req.body.school_address
    let password = req.body.password
    let image = req.file.buffer.toString('base64')

    let query = `INSERT INTO head_teacher_talbe
    (first_name, last_name, email, password, school_name, school_address, school_logo)
    VALUE('${first_name}', '${last_name}', '${email}',
    '${password}', '${school_name}', '${school_address}','${image}')
    `;

    database.query(query, function(err, data){
        if(err){
            throw err;
        }else{
            res.redirect('/')
        }
    })
})
    
router.get('/editschool/:id', function(req, res){
    let id = req.params.id;
    let query = `SELECT * FROM head_teacher_talbe WHERE id = '${id}'`;
    database.query(query, function(err, data){
        if (err){
            throw err
        }else{
            res.render('registerschool', {
                title: 'Edit School Info',
                action: 'edit',
                htData: data[0],
                session: req.session
            })
        }
    })
})

router.post('/editschool/:id', function(req, res){
    let id = req.params.id
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let email = req.body.email
    let school_name = req.body.school_name
    let school_address = req.body.school_address

    let query = `UPDATE head_teacher_talbe
    SET 
    first_name = '${first_name}',
    last_name = '${last_name}',
    email = '${email}',
    school_name = '${school_name}',
    school_address = '${school_address}'
    WHERE id = '${id}'
    `;

    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.redirect('/')
        }
    })
})

router.get('/editImage/:id', function(req, res){
    let id = req.params.id;
    let query = `SELECT * FROM head_teacher_talbe WHERE id = '${id}'`;
    database.query(query, function(err, data){
        if (err){
            throw err
        }else{
            res.render('registerschool', {
                title: 'Edit School LOGO',
                action: 'editImage',
                editImage: data[0],
                session: req.session
            })
        }
    })
})

router.post('/editImage/:id', upload.single('image'), function(req, res){
    let id = req.params.id
    let school_logo = req.file.buffer.toString('base64')
    let sql = `UPDATE head_teacher_talbe
    SET
    school_logo = '${school_logo}'
    WHERE id = '${id}'
    `;
    database.query(sql, function(err, data){
        if(err){
            throw err;
        }else{
            res.redirect('/')
        }
    })

})


module.exports = router;