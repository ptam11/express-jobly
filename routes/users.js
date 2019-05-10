const express = require('express');
const router = new express.Router();
const User = require('../models/userModel');
const jsonschema = require('jsonschema');
const usersSchema = require('../schema/usersSchema');
const ExpressError = require('../helpers/ExpressError');
const { isAuthorized, isCurUser } = require('../middleware/authorization');

// const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');
// const bcrypt = require('bcrypt');

router.get('/' , async function(req, res, next){
  let params = req.query;
  try{
    let results = await User.findAll(params);
    return res.status(200).json({users: results});
  } catch (err){
    next(err);
  }
});

router.post('/', async function(req, res, next){
  try {
    const isValid = jsonschema.validate(req.body, usersSchema);
    
    if(isValid.errors.length) {
      let errors = isValid.errors.map(err => err.stack);
      throw new ExpressError(errors, 400);
    }
    console.log('routes: post request to /user ');
    
    try{
      const results = await User.create(req.body);
      return res.status(201).json({user: results});
    } catch (err){
      throw new ExpressError('ERROR: something went wrong', 400);
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

router.patch('/:username', isCurUser, async function(req, res, next){
  try {
    // prevent making empty requests, will expect a token at minimum
    if (Object.keys(req.body).length < 2) {
      throw new ExpressError('Changes must be provided for PATCH request', 400);
    }

    const existingData = await User.findOne(req.params.username);
    if (!existingData) {
      throw new ExpressError('user not found', 404);
    }
    // combining the partial data to pass schema
    const combinedData = Object.assign(existingData, req.body);
    const isValid = jsonschema.validate(combinedData, usersSchema);

    if(isValid.errors.rowCount) {
      // get all errors from schema for all invalid fields
      let errors = isValid.errors.map(error => error.stack);
      throw new ExpressError(errors, 400);
    }
    
    // requires admin privelages to update admin privelages on a user   
    if (!res.locals.isAdmin && req.body.hasOwnProperty('is_admin')) {
      delete req.body.is_admin;
      throw new ExpressError('Must be an admin to change admin privelages', 401);
    }

    const results = await User.update(req.params.username, req.body);
    return res.json({user: results});
  } catch(err) {
    next(err);
  }
});

router.delete('/:username', isCurUser, async function(req, res, next){
  try {
    const results = await User.delete(req.params.username);
    
    if(results) {
      return res.json({message: "user deleted"});
    } else {
      throw new ExpressError("user not found", 404);
    }
  } catch(err) {
    next(err);
  }
});


module.exports = router;