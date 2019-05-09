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
// for username 'ptam'; photo_url: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCZRdW_GBvY_lzXhuDxX--xTn7CmoBBIU3kpmMOj6gBTF2lLmp

const newUser = {
  username: 'jMatthias',
  first_name: 'Jason',
  last_name: 'Matthias',
  email: 'jMatthias@rithm.com',
  photo_url:
		'data:image/jpeg;base64,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'
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
    const expRes = { users: [ user ] };

    // expect {users: [{username, first_name, last_name, email}, ...]}
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('BONUS FEATURE: search by users. Not on requirement. DELETE test if not done', async function() {
    const res = await request(app).get('/users?search=p');

    // wrap in users for array of users
    const expRes = { users: [ user ] };

    // expect {users: [{username, first_name, last_name, email}, ...]}
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('it should retrieve a specified user from the DB', async function() {
    const res = await request(app).get('/user/ptam');

    // deep copy object, not just ref of obj.
    const cloneUser = Object.assign({}, user);

    // add photo_url to 'user'. Wrap in user object for single user
    cloneUser['photo_url'] =
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCZRdW_GBvY_lzXhuDxX--xTn7CmoBBIU3kpmMOj6gBTF2lLmp';
    const expRes = { user: cloneUser };

    // expect {user: {username, first_name, last_name, email, photo_url}}
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('it should receive error for nonexistent user from DB', async function() {
    const res = await request(app).get('/users/LOLNO');

    expect(res.statusCode).toBe(404);
  });
});

describe('POST /users', function() {
  // testing POST rquests for /companies route

  test('it should add a user to the database', async function() {
    const res = await request(app).post('/users').send(newUser);
    const expRes = { user: newUser };

    // expect {user: {username, first_name, last_name, email, photo_url}}
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(expRes);

    // expect 2 results from database. Used routes to test.
    const getAll = await request(app).get('/users');
    expect(getAll.users).toHaveLength(2);
  });

  test(`it should throw an error if new user has missing NOT NULL first_name`, async function() {
    // deep copy object, not just ref of obj.
    const cloneNewUser = Object.assign({}, newUser);

    // remove first_name to create an erroroneous case
    delete cloneNewUser.first_name;

    // expect error;
    const res = await request(app).post('/users').send(cloneNewUser);
    expect(res.statusCode).toBe(400);
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
