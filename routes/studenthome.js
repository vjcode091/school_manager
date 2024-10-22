const express = require('express')
const session = require('express-session')
const database = require('../database.js')

const router = express.Router();

router.get('/', function(req, res){
    res.render('studenthome', {
        title: 'Student HomePage'
    })
})

module.exports = router;