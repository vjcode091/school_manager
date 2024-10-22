const express = require('express')
const database = require('../database.js')
const session = require('express-session')

 const router = express.Router()

 router.get('/', function(req, res, next){
    let userid = req.session.user_id;
    let query = `SELECT * FROM teachers_table
    JOIN class_table ON teachers_table.class_id = class_table.class_id
    JOIN head_teacher_talbe ON teachers_table.school_id = head_teacher_talbe.id
    WHERE teachers_table.school_id = '${userid}'
    `;
    let query2 = `SELECT * FROM class_table
    WHERE class_table.school_id = '${userid}'
    `;

    database.query(query, function(err, data){
        if(err){
            throw err;
        }else{
            database.query(query2, function(err, data2){
                if (err) throw err;
                res.render('teachers', {
                    title: 'teachers dash board',
                    action: 'list',
                    teacherdata: data,
                    classSelect: data2,
                    session: req.session
                })
            })
        }
    })
 })

 router.post('/add_teacher', function(req, res){
    const userid = req.session.user_id;
    let teacherName = req.body.teacher_name;
    let classId = req.body.class_id;
    let phoneNumber = req.body.phone_number
    let schoolID = req.body.school_id

    let query = `INSERT INTO teachers_table
    (teacher_name, class_id, phone_number, school_id)
    VALUES("${teacherName}", "${classId}", "${phoneNumber}", "${userid}")
    `;

    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.redirect('/teachers');
        }
    })
 })

 router.get('/edit_teacher/:teacher_id', function(req, res){
    let id = req.params.teacher_id;
    let userid = req.session.user_id
    let query = `SELECT * FROM teachers_table
    JOIN class_table ON teachers_table.class_id = class_table.class_id
    JOIN head_teacher_talbe ON teachers_table.school_id = head_teacher_talbe.id
    WHERE teachers_table.teacher_id = "${id}"`;

    let query2 = `SELECT * FROM class_table
    WHERE class_table.school_id = '${userid}'
    `;

    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            database.query(query2, function(err, data2){
                if (err) throw err;
                res.render('teachers',{
                    title: 'Edit Teacher',
                    action: 'edit',
                    teacheredit: data[0],
                    classSelect: data2,
                    session: req.session
                })
            })
        }
    })
 })

 router.post('/edit_teacher/:teacher_id', function(req, res, next){
    let id = req.params.teacher_id;
    let teacherName = req.body.teacher_name
    let phoneNumer = req.body.phone_number
    let classId = req.body.class_id
    let schoolID = req.body.school_id

    let query = `UPDATE teachers_table
    SET teacher_name = '${teacherName}',
    class_id = '${classId}',
    phone_number = '${phoneNumer}',
    school_id = '${schoolID}'
    WHERE teacher_id = '${id}'
    `;

    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.redirect('/teachers');
        }
    })
 })
 
 router.get('/delete_teacher/:teacher_id', function(req, res, next){
    let id = req.params.teacher_id;
    let query = `DELETE FROM teachers_table WHERE teacher_id = '${id}'`;

    database.query(query, function(err, data){
        if (err) {
            throw err;
        }else{
            res.redirect('/teachers')
        }
    })
 })


 module.exports = router;