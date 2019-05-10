const express = require('express');
const router = new express.Router();
const User = require('../models/userModel');
const createToken = require('../helpers/createToken');

router.post('/', async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    
    const token = createToken(user);
    return res.json({token});
  } catch (error) {
    return next(error)
  }
});

module.exports = router;