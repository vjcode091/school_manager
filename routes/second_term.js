const express = require('express')
const database = require('../database.js')
const session = require('express-session')

const router = express.Router()

router.get('/:student_id', function(req, res){
    let schoolid = req.session.school_id
    let id = req.params.student_id
    let query = `SELECT * FROM 2nd_term
    JOIN student_table ON 2nd_term.student_id = student_table.student_id
    JOIN subject_table ON 2nd_term.subject_id = subject_table.subject_id
    WHERE 2nd_term.student_id = '${id}'
    `;
    let query2 = `SELECT * FROM student_table
    JOIN class_table ON student_table.class_id = class_table.class_id
    JOIN head_teacher_talbe ON student_table.school_id = head_teacher_talbe.id
    WHERE student_table.student_id = '${id}'
    `;
    let selectSql = `SELECT * FROM subject_table WHERE school_id = '${schoolid}'`;
    let studentIDSql = `SELECT * FROM student_table WHERE school_id = '${schoolid}'`;
    database.query(query, function(err, data){
        if(err){
            throw err;
        }else{
            database.query(query2, function(err, data2){
                if (err){
                    throw err;
                }else{
                    database.query(selectSql, function(err, selectData){
                        if (err) throw err;
                        database.query(studentIDSql, function(err, studentData){
                            if (err) throw err;
                            res.render('second_term', {
                            title: 'Student Term Result',
                            action: 'list',
                            studentresult: data,
                            tableinfo: data2,
                            session: req.session,
                            selectData: selectData,
                            studentData: studentData[0]
                        })
                        })
                            })
                        }
                    })
                }
            })
        })

router.post('/edit_result', function(req, res, next){
    let subjectId = req.body.subject_id
    let studentId = req.body.student_id
    let ca1 = req.body.ca_1
    let ca2 = req.body.ca_2
    let ca3 = req.body.ca_3
    let ca4 = req.body.ca_4
    let exam = req.body.exam

    let query = `INSERT INTO 2nd_term
    (subject_id, student_id, ca_1, ca_2, ca_3, ca_4,ca_total, 
    exam, grand_total, grade, teacher_remark)
    VALUES('${subjectId}', '${studentId}',
    '${ca1}', '${ca2}', '${ca3}', '${ca4}',
    ca_1 + ca_2 + ca_3 + ca_4, '${exam}', 
    ca_total + exam, Case when grand_total>= 80 then 'A1'
    when grand_total>= 70 then 'B2'
    when grand_total>= 65 then 'B3'
    when grand_total>= 60 then 'C4'
    when grand_total>= 55 then 'C5'
    when grand_total>= 50 then 'C6'
    when grand_total>= 45 then 'D7'
    when grand_total>= 40 then 'E8'
    else 'F9' END,
    Case when grand_total>= 80 then 'Excellent'
    when grand_total>= 65 then 'V.Good'
    when grand_total>= 50 then 'Credit'
    when grand_total>= 40 then 'Fair'
    else 'Poor' END)
    `;

    database.query(query, function(err, data){
        if(err){
            throw err;
        }else{
            res.send(`<div style="text-align: center;">
                <p>You added new result score to Student with this ID 
                <span style="color: blue; font-size: 24px;"> ${studentId}</span></p>
                 <a href="/second_term/${studentId}">
                 <button style="padding: 12px; 
                 font-size: 34px; font-weight: bold;
                 background: rgba(120, 200, 254, 0.7)">
                 Done
                 </button></a>
                 </div>`)
        }
    })
})

router.get('/edit/:second_term_id', function(req, res){
    let id = req.params.second_term_id
    let query = `SELECT * FROM 2nd_term
    JOIN student_table ON 2nd_term.student_id = student_table.student_id
    JOIN subject_table ON 2nd_term.subject_id = subject_table.subject_id
    WHERE 2nd_term.second_term_id = ${id}
    `;

    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.render('second_term', {
                title: 'Second term result edit',
                action: 'edit',
                editdata: data[0],
                session: req.session
            })
        }
    })
})

router.post('/edit/:second_term_id', function(req, res){
    let id = req.params.second_term_id
    let subject_id = req.body.subject_id
    let student_id = req.body.student_id
    let ca1 = req.body.ca_1
    let ca2 = req.body.ca_2
    let ca3 = req.body.ca_3
    let ca4 = req.body.ca_4
    let exam = req.body.exam

    let query = `UPDATE 2nd_term
    SET subject_id = '${subject_id}',
    student_id = '${student_id}',
    ca_1 = '${ca1}',
    ca_2 = '${ca2}',
    ca_3 = '${ca3}',
    ca_4 = '${ca4}',
    ca_total = ca_1 + ca_2 + ca_3 + ca_4,
    exam = '${exam}',
    grand_total = ca_total + exam,
    grade = Case 
    when grand_total>= 80 then 'A1'
    when grand_total>= 70 then 'B2'
    when grand_total>= 65 then 'B3'
    when grand_total>= 60 then 'C4'
    when grand_total>= 55 then 'C5'
    when grand_total>= 50 then 'C6'
    when grand_total>= 45 then 'D7'
    when grand_total>= 40 then 'E8'
    else 'F9' 
    END,
    teacher_remark = Case
    when grand_total>= 80 then 'Excellent'
    when grand_total>= 65 then 'V.Good'
    when grand_total>= 50 then 'Credit'
    when grand_total>= 40 then 'Fair'
    else 'Poor' END
    WHERE 2nd_term.second_term_id = '${id}'
    AND 2nd_term.student_id = '${student_id}'
    `;
    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.send(`
                <div style="text-align: center; margin-top: 20%;">
                <h2 style="font-size: 50px">Score Updated</h2>
                <a href="/second_term/${student_id}">
                <button style="padding: 20px; font-size: 40px; color: whitesmoke;
                background: rgba(120, 120, 220, 0.6);">
                Done
                </button>
                </a>
                </div>
                `);
        }
    })
})

router.get('/delete/:second_term_id', function(req, res, next){
    let id = req.params.second_term_id
    let query = `DELETE FROM 2nd_term WHERE second_term_id = '${id}'`;
    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.redirect(`/teacher`)
        }
    })
})


module.exports = router;