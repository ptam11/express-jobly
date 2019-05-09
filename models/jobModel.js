const db = require('../db');
const app = require('../app');
const ExpressError = require('../helpers/expressError');
const partialUpdate = require('../helpers/partialUpdate');

class Jobs{

  static async findAll(data){
    let query = 'SELECT * FROM jobs';
    let param = [];
    let expressions = [];
    //use middleware to convert query max/min to number or refactor this
    if(data.min_salary){
      param.push(+data.min_salary);
      expressions.push(` salary >= $${param.length}`);
    }
    if(data.min_equity){
      param.push(+data.min_equity);
      expressions.push(` equity >= $${param.length}`);
    }
    if(data.search){
      param.push(data.search);
      expressions.push(`title ILIKE $${param.length}`);
    }
      
    if (param.length > 0){

      query += ' WHERE ' + expressions.join(' AND ') + 'ORDER BY date_posted DESC';
          
      let result = await db.query(query, param);
      return result.rows;
    }
    let result = await db.query(`SELECT * FROM jobs ORDER BY date_posted DESC`);
    return result.rows;
  }

  static async create(data) {
    let results = await db.query(`INSERT INTO companies 
          (handle, name, num_employees, description, logo_url)
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING handle, name, num_employees, description, logo_url;`, [
      data.handle,
      data.name, 
      data.num_employees, 
      data.description, 
      data.logo_url
    ]);
    return results.rows[0];
  }

  static async findOne(handle) {
    let results = await db.query(`SELECT * FROM companies 
          WHERE handle = $1;`, [handle]);
    return results.rows[0];
  }

  static async update(handle, data) {
    // function sqlForPartialUpdate(table, items, targetKey, id) 
    // return { query, values }
    let { query, values } = partialUpdate('companies', data, 'handle', handle);
    let results = await db.query(query, values);
    return results.rows[0];
  }

  static async delete(handle) {
    let results = await db.query(`DELETE FROM companies 
          WHERE handle = $1;`, [handle]);
    return results;
    // .rows.length === 1 ? true : false;
  }

}
module.exports = Jobs;