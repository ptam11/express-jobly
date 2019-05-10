// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');
const { createData, user, newUser, patchUser } = require('../../helpers/_test-common');
const db = require('../../db');

// create a username 'ptam'
beforeEach(async () => {
  await createData();
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
    delete user['password'];
    delete user['is_admin'];

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
    delete user['password'];
    delete user['is_admin'];

    // wrap in users for array of users
    const expRes = { users: [ user ] };

    // expect {users: [{username, first_name, last_name, email}, ...]}
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('it should retrieve a specified user from the DB', async function() {
    const res = await request(app).get(`/users/${user.username}`);
    delete user['password'];
    delete user['is_admin'];

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
    delete newUser['password'];
    delete newUser['is_admin'];
    const expRes = { user: newUser };

    // expect {user: {username, first_name, last_name, email, photo_url}}
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(expRes);

    // expect 2 results from database. Used routes to test.
    const resGet = await request(app).get('/users');
    expect(resGet.body.users).toHaveLength(2);
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
    const expRes = { user: Object.assign(patchUser, user) };

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
    const resGet = await request(app).get('/users');
    expect(resGet.body.users).toHaveLength(0);
  });

  test('it should throw an error when trying to delete company not in DB', async function() {
    const res = await request(app).delete('/companies/w00t');
    
    // expect error
    expect(res.statusCode).toBe(404);
  });
});

