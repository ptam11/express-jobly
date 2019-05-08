
const db = require('../db')
const app = require('../app')
const ExpressError = require('../helpers/expressError')
const partialUpdate = require('../helpers/partialUpdate')

class Company{

    static async findAll(data){
        let query = 'SELECT handle, name FROM companies'
        let param = []
        let expressions = []
        //use middleware to convert query max/min to number or refactor this
        if (data.min_employees && data.max_employees && (data.min_employees > data.max_employees)){
            throw new ExpressError('ERROR: min must be less than max', 400)
        }
        if(data.min_employees){
            param.push(+data.min_employees)
            expressions.push(`num_employees <= $${param.length}`)
        }
        if(data.max_employees){
            param.push(+data.max_employees)
            expressions.push(`num_employees >= $${param.length}`)
        }
        if(data.search){
            param.push(data.search)
            expressions.push(`name ILIKE $${param.length}`)
        }
        console.log(param)
        if (param.length > 0){
            let formattedQuery = query + 'WHERE'
            let formattedparam = param.join(' AND ')
            console.log()
            let companies = await db.query(formattedQuery,[formattedparam])
            return companies.rows
        }
        let result = await db.query(`SELECT handle, name FROM companies`)
        return result.rows
    }
}
module.exports = Company;