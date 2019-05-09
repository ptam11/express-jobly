const express = require('express');
const router = new express.Router();
const User = require('../models/userModel');
const jsonschema = require('jsonschema');
const usersSchema = require('../schema/usersSchema');
const ExpressError = require('../helpers/ExpressError');

// const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');
// const bcrypt = require('bcrypt');

router.get('/' , async function(req, res, next){
  let params = req.query;
  try{
    let result = await User.findAll(params);
    return res.status(200).json({users: result});
  } catch (err){
    next(err);
  }
});

router.post('/', async function(req, res, next){
  try {
    const isValid = jsonschema.validate(req.body, usersSchema);
    
    if(isValid.errors.length) {
      throw new ExpressError('invalid form', 400);
    }
    try{
      const results = await User.create(req.body);
      return res.status(201).json({user: results});
    } catch (err){
      throw new ExpressError('ERROR: no handle of that name', 400);
    }
  } catch(err) {
    next(err);
  }
});

router.get('/:username', async function(req, res, next){
  try {
    const results = await User.findOne(req.params.username);
    
    if (!results) {
      throw new ExpressError('user not found', 404);
    }
    return res.json({user: results});
  } catch(err) {
    next(err);
  }
});

router.patch('/:username', async function(req, res, next){
  try {
    const existingData = await User.findOne(req.params.username);
    if (!existingData) {
      throw new ExpressError('user not found', 404);
    }
    // combining the partial data to pass schema
    const combinedData = Object.assign(existingData, req.body);
    const isValid = jsonschema.validate(combinedData, usersSchema);
    if(isValid.errors.rowCount) {
      // get all errors from schema for all invalid fields
      let listOfErrors = isValid.errors.map(error => error.stack);
      throw new ExpressError(listOfErrors, 400);
    }
    // using req.body to patch only requested data
    const results = await User.update(req.params.username, req.body);
    return res.json({user: results});
  } catch(err) {
    next(err);
  }
});

router.delete('/:username', async function(req, res, next){
  try {
    const results = await User.delete(req.params.username);
    
    if(results.rowCount === 1) {
      return res.json({message: "user deleted"});
    } else {
      throw new ExpressError("user not found", 404);
    }
  } catch(err) {
    next(err);
  }
});


module.exports = router;