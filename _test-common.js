const db = require('./db');


async function createData() {
  await db.query("DELETE FROM companies");

  await db.query(`
        INSERT INTO companies (
            handle,
            name,
            num_employees,
            description,
            logo_url)
        VALUES ($1, $2, $3, $4, $5)
    `, [
    "SBUX",
    "Starbucks",
    100000,
    "seattle based coffee company, we burn our coffee often, includes sugar",
    "https://starbucks.com/logo.jpg",
  ]);
  await db.query (`INSERT INTO jobs
      (title, salary, equity, company_handle, date_posted)
      Values ('tester', 1000.00, 0, 'SBUX', CURRENT_TIMESTAMP);`
    )
  }
module.exports = {
  createData
};