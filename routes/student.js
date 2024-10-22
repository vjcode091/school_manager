const express = require('express');
const database = require('../database.js')
const session =  require('express-session')

const router = express.Router();

router.get('/', function(req, res){
let userid = req.session.user_id;
let query = `SELECT * FROM student_table
    JOIN head_teacher_talbe ON student_table.school_id = head_teacher_talbe.id
    JOIN class_table ON student_table.class_id = class_table.class_id
    WHERE student_table.school_id = '${userid}'
    `;

    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.render('student', {
                title: 'Student Page',
                action: 'list',
                showdata: data,
                session: req.session
            });
        }
    })
})
router.get('/add_student', function(req, res){
    let id = req.session.user_id;
    let school_id = req.params.school_id
    let selectClass = `SELECT * FROM class_table WHERE school_id = '${id}'`;
    database.query(selectClass, function(err, data){
        if (err) throw err;
        res.render('student', {
            title: 'Add New Student',
            action: 'add',
            classSelect: data,
            session: req.session
        })
    })
})

router.post('/add_student', function(req, res, next){
    let first_name = req.body.student_name;
    let sur_name = req.body.sur_name;
    let other_name = req.body.other_name
    let age = req.body.age;
    let gender = req.body.gender;
    let phone_number = req.body.phone_number
    let class_id = req.body.class_id
    let school_id = req.body.school_id

    let query = `INSERT INTO student_table
    (student_name, sur_name, other_name, age, gender, phone_number, class_id, school_id)
    VALUES('${first_name}', '${sur_name}', '${other_name}', '${age}','${gender}',  '${phone_number}',
    '${class_id}', '${school_id}')
    `;

    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.redirect('/student');
        }
    })
 })

 router.get('/edit_student/:student_id', function(req, res){
    let id = req.params.student_id;
    let query = `SELECT * FROM student_table
    JOIN class_table ON student_table.class_id = class_table.class_id
     WHERE student_id = '${id}'`;
    database.query(query, function(err, data){
        if (err) throw err;
            res.render('student', {
                title: 'Edit Student Info',
                action: 'edit',
                studentedit: data[0],
                session: req.session
            })
        })
    })

 router.post('/edit_student/:student_id', function(req, res){
    let id = req.params.student_id;
    let first_name = req.body.student_name
    let sur_name = req.body.sur_name
    let other_name = req.body.other_name
    let age = req.body.age
    let phone_number = req.body.phone_number
    let school_id = req.body.school_id
    let query = `UPDATE student_table
    SET student_name = '${first_name}',
    sur_name = '${sur_name}',
    other_name = '${other_name}',
    age = '${age}',
    phone_number = '${phone_number}',
    school_id = '${school_id}'
    WHERE student_id = '${id}'
    `;

    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.redirect('/student');
        }
    })
 })

 router.get('/delete_student/:student_id', function(req, res){
    let id = req.params.student_id;
    let query = `DELETE FROM student_table WHERE student_id = '${id}'`;

    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.redirect('/student');
        }
    })
 })

 module.exports = router;