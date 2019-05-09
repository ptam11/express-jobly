const db = require('../db');
const app = require('../app');
const ExpressError = require('../helpers/expressError');
const partialUpdate = require('../helpers/partialUpdate');

class Jobs{

  static async findAll(data){
    let query = 'SELECT title, company_handle FROM jobs';
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
    let result = await db.query(query + ` ORDER BY date_posted DESC`);
    return result.rows;
  }

  static async create(data) {
    let results = await db.query(`INSERT INTO jobs 
          (title, salary, equity, company_handle, date_posted)
          VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
          RETURNING id, title, salary, equity, company_handle, date_posted;`, [
      data.title,
      data.salary, 
      data.equity, 
      data.company_handle
    ]);
    return results.rows[0];
  }

  static async findOne(id) {
    let results = await db.query(`SELECT * FROM jobs 
          WHERE id = $1;`, [id]);
    return results;
  }

  static async update(id, data) {
    let { query, values } = partialUpdate('jobs', data, 'id', id);
    let results = await db.query(query, values);
    return results;
  }

  static async delete(id) {
    let results = await db.query(`DELETE FROM jobs 
          WHERE id = $1;`, [id]);
    return results;
  }

}
module.exports = Jobs;