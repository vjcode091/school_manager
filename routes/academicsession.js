const express = require('express');
const database = require('../database.js');
const session = require('express-session')

const router = express.Router();

router.get('/:id', function(req, res){
    let id = req.params.id;
    let sql = `SELECT * FROM head_teacher_talbe WHERE id = ${id}`;
    database.query(sql, function(err, data){
        if (err) throw err;
        res.render('academicsession', {
            title: 'Academic Session',
            academic: data[0],
            session: req.session
        })
    })
})

router.post('/update/:id', function(req, res){
    let session_user = req.session.user_id
    let AS = req.body.session;
    let resumption = req.body.resumption
    let id = req.params.id
    let sql = `UPDATE head_teacher_talbe SET
    academic_session = '${AS}',
    resumption_date = '${resumption}'
    WHERE id = '${id}'
    `;
    database.query(sql, function(err, data){
        if (err) throw err;
        res.send(`<h1>Academic Session Edited</h1>`)
    })
})

module.exports = router;