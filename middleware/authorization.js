const jwt = require('jsonwebtoken');
const { SECRET_KEY }  = require('../config');
const ExpressError = require('../helpers/expressError');


function isCurUser(req, res, next){
  try {
    let tokenString = req.body._token;
    let token = jwt.verify(tokenString, SECRET_KEY);
    res.locals.username = token.username;
    res.locals.isAdmin = token.is_admin;
    
    if (res.locals.username === req.params.username) {
      return next();
    } else {
      throw new ExpressError('Incorrect username', 401);
    }
  } catch (error) {
    return next(error);
  }
}

function isAuthorized(req, res, next){
  try {
    let tokenString = req.body._token || req.query._token;
    
    let token = jwt.verify(tokenString, SECRET_KEY);
    res.locals.username = token.username;
    return next();    
  } catch (error) {
    next(new ExpressError(error, 401));
  }
}

function isAdmin(req, res, next){
  try {
    let tokenString = req.body._token;
    let token = jwt.verify(tokenString, SECRET_KEY);
    res.locals.isAdmin = token.is_admin;
    if (token.is_admin) {
      return next();
    } else {
      throw new ExpressError('Admin rights required', 401);
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  isAuthorized,
  isCurUser,
  isAdmin
};