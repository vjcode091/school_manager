const express = require('express');
const session = require('express-session');
const database = require('../database.js')

const router = express.Router();

router.get('/chart_data/:student_id', function(req, res){
    let student_id = req.session.student_id;
    let sql = `SELECT * FROM skill_chart
    JOIN skills ON skill_chart.skills_id = skills.id
    WHERE student_id = '${student_id}'`;
    database.query(sql, function(err, results){
        if (err) throw err;
        res.json(results);
    })
})

router.get('/', function(req, res){
    res.header('Content-Security-Policy', 
        `script-src 'self' https://cdn.jsdelivr.net/npm/chart.js`);
        res.header('Content-Type', `text/html`)
    let school_id = req.session.school_id
    let id = req.session.student_id
    let class_id = req.session.class_id
    let query = `SELECT * FROM 2nd_term
    JOIN subject_table ON 2nd_term.subject_id = subject_table.subject_id
    WHERE student_id = '${id}'`;
    let query2 = `SELECT AVG(grand_total) AS average_total FROM 2nd_term
    WHERE student_id = '${id}'
    `;
    let query3 =`SELECT count(student_id) AS class_total FROM student_table
    WHERE class_id = '${class_id}'
    `;
    let query4 = `SELECT sum(grand_total) AS sum_total FROM 2nd_term
    WHERE student_id = '${id}'
    `;
    let sqlimage = `SELECT * FROM head_teacher_talbe WHERE id = '${school_id}'`;
    database.query(query, function(err, data){
        if (err) {
            throw err;
        }else{
            database.query(query2, function(err, data2){
                if (err){
                    throw err;
                }else{
                    let avgRoundUp = parseFloat(data2[0].average_total).toFixed(2);
                    let grade = getGrade(avgRoundUp);
                    database.query(query3, function(err, data3){
                        if (err){
                            throw err;
                        }else{
                            database.query(query4, function(err, dataAdd){
                                if (err){
                                    throw err;
                                }else{
                                    database.query(sqlimage, function(err, dataImage){
                                        if (err){
                                            throw err;
                                        }else{
                                            res.render('student_login2', {
                                                title: 'School Base',
                                                sdata: data,
                                                avg: avgRoundUp,
                                                grade: grade,
                                                dataC: data3[0].class_total,
                                                dataAdd: dataAdd[0].sum_total,
                                                image: dataImage,
                                                session: req.session
                                            });
                                        }
                                    })
                                }
                            })
                            
                        }
                    })
                }
            })
    }
    })
})

function getGrade(grand_total){
    if (grand_total >= 80){
        return 'A';
    }else if (grand_total >= 70){
        return 'B';
    }else if (grand_total >= 50){
        return 'C';
    }else if (grand_total >= 40){
        return 'D';
    }else{
        return 'F';
    }
}

router.post('/', function(req, res, next){
    let student_id = req.body.student_id
    let phone_number = req.body.phone_number

    if(student_id && phone_number){
        let query = `SELECT * FROM student_table
        JOIN class_table ON student_table.class_id = class_table.class_id
        JOIN head_teacher_talbe ON student_table.school_id = head_teacher_talbe.id
        WHERE student_id = '${student_id}'
        `;
        database.query(query, function(err, data){
            if(data.length > 0){
                for(var count = 0; count < data.length; count++){
                    if(data[count].phone_number == phone_number)
                    {
                        req.session.student_id = data[count].student_id;
                        req.session.student_name = data[count].student_name;
                        req.session.sur_name = data[count].sur_name;
                        req.session.other_name = data[count].other_name
                        req.session.class_id = data[count].class_id
                        req.session.class_name = data[count].class_name
                        req.session.result_id = data[count].result_id
                        req.session.school_id = data[count].school_id;
                        req.session.school_name = data[count].school_name;
                        res.redirect('/student_login2');
                    }else{
                        res.send('incorrect phone_number')
                    }
                }
            }else{
                res.send('Incorrect User Name');
            }
        })
    }else{
        res.send('please Enter right phone_number or username!');
    }
})


router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/student_login2');
})

module.exports = router;