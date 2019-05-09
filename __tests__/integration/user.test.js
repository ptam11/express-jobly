// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');
const { createData } = require('../../_test-common');
const db = require('../../db');

// json of response for just 1 user, needs to be wrapped by object 'user' || 'users'
let user = {};
let newUser = {};
let patchUser = {};

// username: a primary key that is text
// password: a non-nullable column
// first_name: a non-nullable column
// last_name: a non-nullable column
// email: a non-nullable column that is and unique
// photo_url: a column that is text
// is_admin: a column that is not null, boolean and defaults to false

// create a username 'ptam'
beforeEach(() => {
  createData;
  user = {
    username: 'ptam',
    first_name: 'Parco',
    last_name: 'Tam',
    email: 'ptam@rithm.com',
    photo_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCZRdW_GBvY_lzXhuDxX--xTn7CmoBBIU3kpmMOj6gBTF2lLmp',
    is_admin: false
  };

  newUser = {
    username: 'jmatthias',
    first_name: 'Jason',
    last_name: 'Matthias',
    email: 'jmatthias@rithm.com',
    photo_url:
			'http://japamat.com/imgs/headshot.jpg',
    is_admin: true
  };

  patchUser = {
    first_name: 'Vince',
    last_name: 'Carter'
  };
});

afterAll(function() {
  db.end();
});

describe('GET /users', function() {
  // testing GET requests for /users routes

  test('it should retreive a list of users in the database', async function() {
    const res = await request(app).get('/users');

    // delete item photo_url since not returned
    delete user['photo_url'];

    // wrap in users for array of users
    const expRes = { users: [ user ] };

    // expect {users: [{username, first_name, last_name, email}, ...]}
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('search by users.', async function() {
    const res = await request(app).get('/users?search=p');

    // delete item photo_url since not returned
    delete user['photo_url'];

    // wrap in users for array of users
    const expRes = { users: [ user ] };

    // expect {users: [{username, first_name, last_name, email}, ...]}
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('it should retrieve a specified user from the DB', async function() {
    const res = await request(app).get(`/users/${user.username}`);

    const expRes = { user: user };

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
  // testing POST rquests for /users route

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
    // remove first_name to create an erroroneous case
    delete newUser.first_name;

    // expect error;
    const res = await request(app).post('/users').send(newUser);
    expect(res.statusCode).toBe(400);
  });
});

describe('PATCH /users/:username', function() {
  // testing PATCH requests for /users/:username route

  test('it should update newUser in the database', async function() {
    // creating expected results by merging patched fields with fields that were not changed
    const expRes = { user: Object.assign(patchUser, newUser) };

    const res = await request(app).patch(`/users/${user.username}`).send(patchUser);

    // expect {user: {username, first_name, last_name, email, photo_url}}
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('it should throw an error when trying to update username not in DB', async function() {
    // expect error
    const res = await request(app).patch('/users/w00t').send(patchUser);
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /users/:user', function() {
  // testing DELETE rquests for /users route

  test('it should delete a company from the database', async function() {
    const res = await request(app).delete(`/users/${user.username}`);
    
    // expect DB to have 0 rows
    expect(res.statusCode).toBe(200);
    const getAll = await request(app).get('/users');
    expect(getAll.users).toHaveLength(0);
  });

  test('it should throw an error when trying to delete company not in DB', async function() {
    const res = await request(app).delete('/companies/w00t');
    
    // expect error
    expect(res.statusCode).toBe(404);
  });
});

