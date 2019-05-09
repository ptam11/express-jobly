const express = require('express');
const login = new express.Router();
const Company = require('../models/companyModel');
const jsonschema = require('jsonschema');
const companiesSchema = require('../schema/companiesSchema');
const expressError = require('../helpers/expressError');

router.post('/', async function (req, res, next) {
  let {username, password} = req.body;

  return res.json({token: result});
});

module.exports = login;