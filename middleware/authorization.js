const jwt = require('jsonwebtoken');
const  = require('');
const bcrpyt = require('bcrypt');


function isLoggedIn(obj){
  let {username, password} = obj;
  let bPassword = bcrpyt(password)
}

function isAuthorized(obj){
  let {username, password} = obj;
  
}

function isAdmin(obj){
  let {username, password} = obj;
  
}