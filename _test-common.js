const db = require('./db');


async function createData() {
  await db.query(`DELETE FROM companies`);
  await db.query(`DELETE FROM jobs`);
  await db.query(`SELECT setval('jobs_id_seq', 1, false)`);

  await db.query(`
        INSERT INTO companies (
            handle,
            name,
            num_employees,
            description,
            logo_url)
        VALUES ($1, $2, $3, $4, $5)
    `, [
    'SBUX',
    'Starbucks',
    100000,
    'seattle based coffee company, we burn our coffee often, includes sugar',
    'https://starbucks.com/logo.jpg',
  ]);

  await db.query (`
    INSERT INTO jobs (
      title,
      salary,
      equity,
      company_handle,
      date_posted)
    VALUES ($1, $2, $3, $4, $5);`, 
  [
    'tester',
    1000,
    0.01,
    'SBUX',
    `2019-05-08T23:34:42.000000`
  ]);
}
module.exports = {
  createData
};