
const express = require('express');
const router = new express.Router();
const Company = require('../models/companyModel');
const jsonschema = require('jsonschema');
const companiesSchema = require('../schema/companiesSchema');
const expressError = require('../helpers/expressError');

// const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');
// const bcrypt = require('bcrypt');

router.get('/' , async function(req, res, next){
  let params = req.query;
  try{
    let result = await Company.findAll(params);
    return res.json({companies: result}, 200);
  } catch (err){
    next(err);
  }
});

router.post('/', async function(req, res, next){
  try {
    const isValid = jsonschema.validate(req.body, companiesSchema);
    
    if(isValid.errors.length) {
      throw new expressError('invalid form', 400);
    }

    const results = await Company.create(req.body);
    return res.json({company: results}, 201);
  } catch(err) {
    next(err);
  }
});

router.get('/:handle', async function(req, res, next){
  try {
    const results = await Company.findOne(req.params.handle);
    if (!results.rowCount) {
      throw new expressError('company not found', 404);
    }
    return res.json({company: results.rows[0]});
  } catch(err) {
    next(err);
  }
});

router.patch('/:handle', async function(req, res, next){
  try {
    const existingData = await Company.findOne(req.params.handle);
    if (!existingData.rowCount) {
      throw new expressError('company not found', 404);
    }
    // combining the partial data to pass schema
    const combinedData = Object.assign(existingData, req.body);
    const isValid = jsonschema.validate(combinedData, companiesSchema);
    if(isValid.errors.rowCount) {
      throw new expressError('invalid form', 400);
    }
    // using req.body to patch only requested data
    const results = await Company.update(req.params.handle, req.body);
    return res.json({company: results});
  } catch(err) {
    next(err);
  }
});

router.delete('/:handle', async function(req, res, next){
  try {
    const results = await Company.delete(req.params.handle);
    if(results.rowCount === 1) {
      return res.json({message: "Company deleted"});
    } else {
      throw new expressError("Company not found", 404);
    }
  } catch(err) {
    next(err);
  }
});


module.exports = router;