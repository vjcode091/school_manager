const express = require('express')
const database = require('../database.js')
const session = require('express-session')

const router = express.Router();

router.get('/', function(req, res, next){
    const userid = req.session.user_id;
    let query = `SELECT * FROM class_table WHERE school_id = '${userid}'`;
    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.render('class', {
                title: 'class dash board',
                action: 'list',
                showdata: data,
                session: req.session
            })
        }
    })
})

router.get('/add_class', function(req, res, next){
    res.render('class', {
        title: 'Add Class',
        action: 'add',
        session: req.session
    })
})

router.post('/add_class', function(req, res){
    let className = req.body.class_name;
    let schoolID = req.session.user_id

    let query = `INSERT INTO class_table
    (class_name, school_id) 
    VALUE ('${className}', '${schoolID}')
    `;

    database.query(query, function(err, data){
        if (err){
            throw err
        }else{
            res.redirect('/class');
        }
    })
})

router.get('/class_info/:class_id', function(req, res, next){
    let id = req.params.class_id;
    const usersub = req.session.user_id
    let query = `SELECT * FROM student_table where class_id = "${id}"
    AND student_table.school_id = '${usersub}'
    `;
    let query2 = `SELECT * FROM teachers_table WHERE class_id = "${id}"
    AND teachers_table.school_id = '${usersub}'`; 


    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            database.query(query2, function(err, data2){
                if (err){
                    throw err;
                }else{
                    res.render('class', {
                        title: 'class info',
                        action: 'class',
                        seedata: data,
                        teachersdata: data2,
                        session: req.session
                    })
                }
            })
        }
    })
})

router.get('/editclass/:class_id', function(req, res){
    let id = req.params.class_id;
    let query = `SELECT * FROM class_table WHERE class_id = '${id}'`;

    database.query(query, function(err, data){
        res.render('class',{
            title: 'Edit Class Name',
            action: 'edit',
            editclass: data[0],
            session: req.session
        })
    })
})

router.post('/editclass/:class_id', function(req, res){
    let id = req.params.class_id;
    let class_name = req.body.class_name;
    let query = `UPDATE class_table
    SET class_name = '${class_name}'
    WHERE class_id = '${id}'
    `;

    database.query(query, function(err, data){
        if(err){
            throw err;
        }else{
            res.redirect('/class');
        }
    })
})

module.exports = router;