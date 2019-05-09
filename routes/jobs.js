const express = require('express');
const router = new express.Router();
const Job = require('../models/jobModel');
const jsonschema = require('jsonschema');
const jobSchema = require('../schema/jobSchema');
const expressError = require('../helpers/expressError');

// const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');
// const bcrypt = require('bcrypt');

router.get('/' , async function(req, res, next){
  let params = req.query;
  try{
    let result = await Job.findAll(params);
    return res.status(200).json({jobs: result});
  } catch (err){
    next(err);
  }
});

router.post('/', async function(req, res, next){
  try {
    const isValid = jsonschema.validate(req.body, jobSchema);
    
    if(isValid.errors.length) {
      throw new expressError('invalid form', 400);
    }
    try{
      const results = await Job.create(req.body);
      return res.status(201).json({job: results});
    } catch (err){
      throw new expressError('ERROR: no handle of that name', 400);
    }
  } catch(err) {
    next(err);
  }
});

router.get('/:id', async function(req, res, next){
  try {
    const results = await Job.findOne(req.params.id);
    
    if (!results.rowCount) {
      throw new expressError('job not found', 404);
    }
    return res.json({job: results.rows[0]});
  } catch(err) {
    next(err);
  }
});

router.patch('/:id', async function(req, res, next){
  try {
    const existingData = await Job.findOne(req.params.id);
    if (!existingData.rowCount) {
      throw new expressError('job not found', 404);
    }
    // combining the partial data to pass schema
    const combinedData = Object.assign(existingData, req.body);
    const isValid = jsonschema.validate(combinedData, jobSchema);
    if(isValid.errors.rowCount) {
      throw new expressError('invalid update job form', 400);
    }
    // using req.body to patch only requested data
    const results = await Job.update(req.params.id, req.body);
    return res.json({job: results.rows[0]});
  } catch(err) {
    next(err);
  }
});

router.delete('/:id', async function(req, res, next){
  try {
    const results = await Job.delete(req.params.id);
    
    if(results.rowCount === 1) {
      return res.json({message: "Job deleted"});
    } else {
      throw new expressError("job not found", 404);
    }
  } catch(err) {
    next(err);
  }
});


module.exports = router;