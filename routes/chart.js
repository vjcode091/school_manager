const express = require('express')
const session = require('express-session')
const database = require('../database.js')

const router = express.Router();

router.get('/:student_id', function(req, res){
    res.header('Content-Security-Policy', 
        `script-src 'self' https://cdn.jsdelivr.net/npm/chart.js`);
        res.header('Content-Type', `text/html`)
    let student_id = req.params.student_id;
    let sql = `SELECT * FROM student_table WHERE student_id = '${student_id}'`;
    let sql2 = `SELECT * FROM skills`;
    //variables below is for the chart table
    let skillChartSql = `SELECT * FROM skill_chart 
    JOIN skills ON skill_chart.skills_id = skills.id
    JOIN student_table ON skill_chart.student_id = student_table.student_id
    WHERE skill_chart.student_id = '${student_id}'`;
    
    database.query(sql, function(err, data){
        if (err) throw err;
        database.query(sql2, function(err, data2){
                if (err) throw err;
                database.query(skillChartSql, function(err, skilldata){
                    if (err) throw err;
                        res.render('chart', {
                            title: 'Chart Update',
                            studentData: data[0],
                            skillData: data2,
                            skillDataTable: skilldata,
                        })
                    })
                })
            })
        })
        
router.post('/skill/:student_id', function(req, res){
    let id = req.params.student_id
    let skill_id = req.body.skill_id
    let student_id = req.body.student_id
    let score = req.body.score

    let sql = `INSERT INTO skill_chart (skills_id, student_id, score)
    VALUES ('${skill_id}', '${student_id}', '${score}')`;

    database.query(sql, function(err, data){
        if (err) throw err;
        res.redirect(`/chart/${id}`);
    })
})

router.get('/deleteskill/:id', function(req, res){
    let id = req.params.id
    let query = `DELETE FROM skill_chart WHERE skills_id = '${id}'`;
    database.query(query, function(err, data){
        if (err){
            throw err;
        }else{
            res.send(`<div>
                <h2 style="font-size: 15px;">Behaviour Deleted</h2>
                <div>
                <a href="/teacher">
                <button style="background: blue; color: white; padding:12px;">
                DONE
                </button>
                </a>
                </div>
                </div>`)
        }
})
})

module.exports = router;