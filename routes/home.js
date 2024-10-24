const express = require('express');
const database = require('../database.js')

const router = express.Router();

router.get('/', function(req, res){
    res.render('index', {
        title: 'School Base'
    })
})

module.exports = router;