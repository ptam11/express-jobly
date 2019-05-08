process.env.NODE_ENV = "test"

const db = require('../../db');
const app = require('../../app')
const { createData } = require('../../_test-common');
const sqlForPartialUpdate = require('../../helpers/partialUpdate')

beforeEach(createData)

describe("sqlForPartialUpdate()", () => {
  test("should generate a proper partial update query with just 1 field",
      async function () {
    const injection = sqlForPartialUpdate(`companies`, {"junk": "0"}, `num_employees; INSERT INTO companies (
      handle,
      name,
      num_employees,
      description,
      logo_url)
  VALUES (hahaahaa, IhackedU, 1, hacked)
  RETURNING handle;`, 1)
    let worked = await db.query(injection.query)
    expect(worked).toEqual('hahaahaa')
    const companies = `SELECT handle FROM companies`
    let result = await db.query(companies)
    expect(result.rows.length).toEqual(2);

  });
});
