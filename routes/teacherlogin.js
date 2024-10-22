const express = require('express')
const database = require('../database.js')
const session = require('express-session')

const router = express.Router()

router.get('/', function(req, res, next){
    let schoolid = req.session.school_id
    let classid = req.session.class_id
    let query = `SELECT * FROM student_table WHERE school_id = '${schoolid}'
    AND class_id = '${classid}'
    `;
    database.query(query, function(err, data){
        res.render('teacherlogin', {
            title: 'Teachers Login Form',
            action: 'list',
            studentdata: data,
            session: req.session
        })
    })
})

router.post('/login', function(req, res, next){
    let teacherId = req.body.teacher_id
    let phone_number = req.body.phone_number

    if(teacherId && phone_number){
        let query = `SELECT * FROM teachers_table JOIN class_table
        ON teachers_table.class_id = class_table.class_id
        JOIN head_teacher_talbe ON teachers_table.school_id = head_teacher_talbe.id
        WHERE teacher_id = '${teacherId}'
        `;
        database.query(query, function(err, data){
            if(data.length > 0){
                for(var count = 0; count < data.length; count++){
                    if(data[count].phone_number == phone_number)
                    {
                        req.session.teacher_id = data[count].teacher_id;
                        req.session.user_name = data[count].teacher_name;
                        req.session.class_name = data[count].class_name;
                        req.session.class_id = data[count].class_id;
                        req.session.school_id = data[count].school_id
                        req.session.school_name = data[count].school_name;
                        res.redirect('/teacher');
                    }else{
                        res.send('incorrect phone_number')
                    }
                }
            }else{
                res.send('Incorrect User ID');
            }
        })
    }else{
        res.send('please Enter right phone_number or user ID!');
    }
})

router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/teacher');
})

module.exports = router;