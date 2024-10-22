const express = require('express');
const session = require('express-session');
const database = require('../database.js')
const router = express.Router();

router.get('/', (req, res)=>{
    const usersub = req.session.user_id;
    let query = `SELECT * FROM subject_table 
    INNER JOIN head_teacher_talbe 
    ON subject_table.school_id = head_teacher_talbe.id
    WHERE school_id = '${usersub}'
    `;

    database.query(query, function(err, data){
        if(err){
            throw err;
        }else{
            res.render('subject', {
                title: 'Your Subjects',
                action: 'list',
                subjectdata: data,
                session: req.session
            });
        }
    })      
})

router.post('/add_subject', function(req, res){
    let addsubject = req.body.subject_name;
    let schoolID = req.body.school_id

    let query = `INSERT INTO subject_table
    (subject_name, school_id) VALUE ('${addsubject}', '${schoolID}')
    `;

    database.query(query, function(err, data){
        if (err){
            throw err
        }else{
            res.redirect('/subject');
        }
    })
})

router.get('/edit_subject/:subject_id', function(req, res, next){
    let id = req.params.subject_id;
    let query = `SELECT * FROM subject_table WHERE subject_id = '${id}'`;

    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.render('subject',{
                title: 'Edit subject',
                action: 'edit',
                editsubject: data[0]
            })
        }
    })
})

router.post('/edit_subject/:subject_id', function(req, res, next){
    let id = req.params.subject_id;
    let subject_name = req.body.subject_name
    let schoolID = req.body.school_id
    let query = `UPDATE subject_table
    SET subject_name = '${subject_name}',
    school_id = '${schoolID}'
    WHERE subject_id = '${id}'
    `;

    database.query(query, function(err, data){
        if(err){
            throw err;
        }else{
            res.redirect('/subject');
        }
        
        })
    })

    router.get('/delete_subject/:subject_id', function(req, res){
        let id = req.params.subject_id;
        let query = `DELETE FROM subject_table WHERE subject_id = '${id}'`;

        database.query(query, function(err, data){
            if(err){
                throw err;
            }else{
                res.redirect('/subject');
            }
        })
    })

module.exports = router;