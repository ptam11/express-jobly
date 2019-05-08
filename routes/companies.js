
const express = require('express');
const router = new express.Router();
const db = require('../db');
const Company = require('../models/companyModel');

// const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config')
// const bcrypt = require('bcrypt');

router.get('/' , async function(req, res, next){
    let params = req.query
    try{
      let result = await Company.findAll(params)
      return res.json(result)
    } catch (err){
        next(err)
    }
})

// router.post('/'){

// }

// router.get('/:handle'){

// }

// router.patch('/:handle'){

// }

// router.delete('/:handle'){

// }

module.exports = router