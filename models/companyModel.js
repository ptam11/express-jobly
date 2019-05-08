const db = require('../db');
const app = require('../app');
const ExpressError = require('../helpers/expressError');
const partialUpdate = require('../helpers/partialUpdate');

class Company {
	static async findAll(data) {
		let query = 'SELECT handle, name FROM companies';
		let param = [];
		let expressions = [];
		//use middleware to convert query max/min to number or refactor this
		if (data.min_employees && data.max_employees && +data.min_employees > +data.max_employees) {
			throw new ExpressError('ERROR: min must be less than max', 400);
		}

		// param.length for query parameterization index
		if (data.min_employees) {
			param.push(+data.min_employees);
			expressions.push(` num_employees >= $${param.length}`);
		}
		if (data.max_employees) {
			param.push(+data.max_employees);
			expressions.push(` num_employees <= $${param.length}`);
		}
		if (data.search) {
			param.push(data.search);
			expressions.push(`name ILIKE $${param.length}`);
		}

		if (param.length > 0) {
			query += ' WHERE ' + expressions.join(' AND ');

			let companies = await db.query(query, param);
			return companies.rows;
		}
		let result = await db.query(`SELECT handle, name FROM companies`);
		return result.rows;
	}

	static async create(data) {
		let results = await db.query(
			`INSERT INTO companies 
            (handle, name, num_employees, description, logo_url)
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING handle, name, num_employees, description, logo_url;`,
			[ data.handle, data.name, data.num_employees, data.description, data.logo_url ]
		);
		return results.rows[0];
	}

	static async findOne(handle) {
		let results = await db.query(
			`SELECT * FROM companies 
            WHERE handle = $1\;`,
			[ handle ]
		);
		return results;
	}

	static async update(handle, data) {
		let { query, values } = partialUpdate('companies', data, 'handle', handle);
		let results = await db.query(query, values);
		return results.rows[0];
	}

	static async delete(handle) {
		let results = await db.query(
			`DELETE FROM companies 
            WHERE handle = $1;`,
			[ handle ]
		);
		return results;
		// .rows.length === 1 ? true : false;
	}
}
module.exports = Company;
