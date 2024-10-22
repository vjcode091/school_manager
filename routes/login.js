const express = require('express');
const session = require('express-session');
const database = require('../database.js')
const multer = require('multer')

const router = express.Router();

router.get('/', function(req, res){
    let id = req.session.user_id
    let sql = `SELECT * FROM head_teacher_talbe WHERE id = '${id}'`;
    let query3 =`SELECT count(student_id) AS class_total FROM student_table
    WHERE school_id = '${id}'`;
    let query4 =`SELECT count(teacher_id) AS teacher_total FROM teachers_table
    WHERE school_id = '${id}'`;
    let query5 = `SELECT count(class_id) AS class_total FROM class_table
    WHERE school_id = '${id}'`;
    let subjectSql = `SELECT count(subject_id) AS subject_total FROM subject_table
    WHERE school_id = '${id}'`;
    database.query(sql, function(err, data){
        if (err){
            throw err;
        }else{
            database.query(query3, function(err, data2){
                if (err) throw err;
                database.query(query4, function(err, data3){
                   if (err) throw err;
                   database.query(query5, function(err, data4){
                    if (err) throw err;
                    database.query(subjectSql, function(err, SubjectData){
                        if (err) throw err;
                        res.render('login', {
                            title: 'School Base',
                            image: data,
                            studentCount: data2[0].class_total,
                            teacherCount: data3[0].teacher_total,
                            classCount: data4[0].class_total,
                            subjectCount: SubjectData[0].subject_total,
                            session: req.session
                        });
                    })
                   })
                })
                
            })
        }
    })
            
    })


router.post('/login', function(req, res, next){
    let firstname = req.body.first_name
    let password = req.body.password

    if(firstname && password){
        let query = `SELECT * FROM head_teacher_talbe
        WHERE first_name = '${firstname}'
        `;
        database.query(query, function(err, data){
            if(data.length > 0){
                for(var count = 0; count < data.length; count++){
                    if(data[count].password == password)
                    {
                        req.session.user_id = data[count].id;
                        req.session.user_name = data[count].first_name;
                        req.session.school = data[count].school_name;
                        req.session.school_logo = data[count].school_logo
                        req.session.school_address = data[count].school_address
                        req.session.academic_session = data[count].academic_session
                        req.session.resumption_date = data[count].resumption_date
                        res.redirect('/login');
                    }else{
                        res.send('incorrect password')
                    }
                }
            }else{
                res.send('Incorrect User Name');
            }
        })
    }else{
        res.send('please Enter right password or username!');
    }
})

router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/login');
})

module.exports = router;