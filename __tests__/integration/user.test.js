// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');
const { createData } = require('../../_test-common');
const db = require('../../db');

// json of response for just 1 user, needs to be wrapped by object 'user' || 'users'
const user = {
  username: 'ptam',
  first_name: 'Parco',
  last_name: 'Tam',
  email: 'ptam@rithm.com'
};

// username: a primary key that is text
// password: a non-nullable column
// first_name: a non-nullable column
// last_name: a non-nullable column
// email: a non-nullable column that is and unique
// photo_url: a column that is text
// is_admin: a column that is not null, boolean and defaults to false

// create a username 'ptam'
beforeEach(createData);

afterAll(function() {
  db.end();
});

describe('GET /users', function() {
  // testing GET requests for /users routes

  test('it should retreive a list of users in the database', async function() {
    const res = await request(app).get('/users');
    
    // wrap in users for array of users
    const expRes = {users: [user]};

    // expect {users: [{username, first_name, last_name, email}, ...]}
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('BONUS FEATURE: search by users. Not on requirement. DELETE test if not done', async function() {
    const res = await request(app).get('/users?search=p');
    
    // wrap in users for array of users
    const expRes = {users: [user]};

    // expect {users: [{username, first_name, last_name, email}, ...]}
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('it should retrieve a specified user from the DB', async function() {
    const res = await request(app).get('/user/ptam');
    
    // wrap in user object for single user
    const expRes = {user: user};
      
    // expect {user: {username, first_name, last_name, email}}
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('it should receive error for nonexistent user from DB', async function() {
    const res = await request(app).get('/users/LOLNO');

    expect(res.statusCode).toBe(404);
  });
});

describe('POST /companies', function() {
  // testing POST rquests for /companies route

  test('it should add a company to the database', async function() {
    const philz = {
      handle: 'PHLZ',
      name: 'Philz',
      num_employees: 1000,
      description: 'SF based coffee company, makes infinitely better coffee than SBUX',
      logo_url: 'https://philz.com/logo.jpg'
    };
    const res = await request(app).post('/companies').send(philz);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ company: philz });
    let getAll = await db.query(`select * from companies`);
    expect(getAll.rows).toHaveLength(2);
  });

  test(`it should throw an error when not provided name & handle`, async function() {
    const philz = {
      name: 'Philz',
      num_employees: 1000,
      description: 'SF based coffee company, makes infinitely better coffee than SBUX',
      logo_url: 'https://philz.com/logo.jpg'
    };
    const res = await request(app).post('/companies').send(philz);
    expect(res.statusCode).toBe(400);
    // expect(res.body).toEqual({company: philz});
  });
});

describe('PATCH /companies', function() {
  // testing PATCH rquests for /companies route

  test('it should update a company in the database', async function() {
    const body = {
      name: 'sTaRbUcKs',
      num_employees: 0,
      description: 'lol make better coffee',
      logo_url: 'https://booooooooo.com/logo.jpg'
    };
    const res = await request(app).patch('/companies/SBUX').send(body);
    expect(res.statusCode).toBe(200);
    body.handle = 'SBUX';
    expect(res.body).toEqual({ company: body });
  });

  test('it should throw an error when trying to update company not in DB', async function() {
    const body = {
      name: 'sTaRbUcKs',
      num_employees: 0,
      description: 'lol make better coffee',
      logo_url: 'https://booooooooo.com/logo.jpg'
    };
    const res = await request(app).patch('/companies/w00t').send(body);
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /companies', function() {
  // testing DELETE rquests for /companies route

  test('it should delete a company from the database', async function() {
    const res = await request(app).delete('/companies/SBUX');
    expect(res.statusCode).toBe(200);
    let getAll = await db.query(`select * from companies`);
    expect(getAll.rows).toHaveLength(0);
  });

  test('it should throw an error when trying to delete company not in DB', async function() {
    const res = await request(app).delete('/companies/w00t');
    expect(res.statusCode).toBe(404);
  });
});
