const jwt = require('jsonwebtoken');
const { SECRET_KEY }  = require('../config');
const bcrpyt = require('bcrypt');


function isLoggedIn(req, res, next){
  let {username, password} = obj;
  let bPassword = bcrpyt(password)
}

function isAuthorized(req, res, next){
  try {
    let tokenString = req.body._token || req.query._token;
    let token = jwt.verify(tokenString, SECRET_KEY);
    res.locals.username = token.username;
    return next;    
  } catch (error) {
    return next(error)
  }
}

function isAdmin(req, res, next){
  let {username, password} = obj;
  
}