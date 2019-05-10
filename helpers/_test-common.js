const db = require('../db');


async function createData() {
  await db.query(`DELETE FROM companies`);
  await db.query(`DELETE FROM jobs`);
  await db.query(`DELETE FROM users`);
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

  await db.query (
    `INSERT INTO users (
      username,
      password,
      first_name,
      last_name,
      email,
      photo_url,
      is_admin
    )
      VALUES ($1, $2, $3, $4, $5, $6, $7);`,
    [
      'ptam',
      'ptam',
      'Parco',
      'Tam',
      'ptam@rithm.com',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCZRdW_GBvY_lzXhuDxX--xTn7CmoBBIU3kpmMOj6gBTF2lLmp',
      false
    ]
  );
}

// for json input/output refactoring
// needs to be wrapped by an object of 'user' || 'users'

const user = {
  username: 'ptam',
  password: 'ptam',
  first_name: 'Parco',
  last_name: 'Tam',
  email: 'ptam@rithm.com',
  photo_url:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCZRdW_GBvY_lzXhuDxX--xTn7CmoBBIU3kpmMOj6gBTF2lLmp',
  is_admin: false
};

const newUser = {
  username: 'jmatthias',
  password: 'jmatthias',
  first_name: 'Jason',
  last_name: 'Matthias',
  email: 'jmatthias@rithm.com',
  photo_url:
    'http://japamat.com/imgs/headshot.jpg',
  is_admin: true
};

const patchUser = {
  first_name: 'Vince',
  last_name: 'Carter'
};
module.exports = {
  createData,
  user,
  newUser,
  patchUser,
};