const db = require('../db');
const app = require('../app');
const ExpressError = require('../helpers/expressError');
const partialUpdate = require('../helpers/partialUpdate');

class User {

  /** 
  * query all users 
  * OR  add 'where' condition for username search URL query  
  **/
  static async findAll(data) {
    let query = 'SELECT username, first_name, last_name, email FROM users';
    let param = [];
    let expressions = [];
    let result;

    // search for partial match of 'username'
    if (data.search) {
      param.push(data.search);
      expressions.push(`username ILIKE $${param.length}`);
    }

    if (param.length > 0) {
      // query with 'WHERE' conditions
      query += ' WHERE ' + expressions.join(' AND ') + 'ORDER BY date_posted DESC';
      result = await db.query(query, param);
    } else {
      // query all without 'WHERE' condition
      result = await db.query(query + ` ORDER BY date_posted DESC`);
    }
    return result.rows;
  }

  /**
  * create new row in DB
  * data may not contain is_admin, if not, DEFAULT false in 'data.sql'
  **/
  static async create(data) {
    let results = await db.query(
      `INSERT INTO users 
          (username, password, first_name, last_name, email, photo_url, is_admin)
          VALUES ($1, $2, $3, $4, $5, $6, $7) 
          RETURNING username, first_name, last_name, email, photo_url;`,
      [ data.username, data.password, data.first_name, data.last_name, data.email, data.photo_url, data.is_admin ]
    );
    return results.rows[0];
  }

  /**
  * search 'username' from URL param
  **/
  static async findOne(username) {
    // find user by username
    let result = await db.query(
      `SELECT * FROM users
          WHERE username = $1;`,
      [ username ]
    );

    // return 1 obj result
    return result.rows[0];
  }

  static async update(username, data) {
    // use helper function partialUpdate(table, items, targetKey, targetVal)
    // returns parameterized query values and query
    let { query, values } = partialUpdate('users', data, 'username', username);
  
    // return patched results
    let result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(username) {
    // delete
    let results = await db.query(
      `DELETE FROM users 
          WHERE username = $1;
          RETURNING *`,
      [ username ]
    );

    // return results, should always be 1, not 0
    return results.rows[0];
  }
}
module.exports = User;
