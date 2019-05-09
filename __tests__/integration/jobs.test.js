// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');
const { createData } = require('../../_test-common');
const db = require('../../db');

beforeEach(createData);

afterAll(function () {
  db.end();
});
const testDate = "2019-05-08 16:34:42.000000";

describe('GET /jobs', function () {
  // testing GET rquests for /jobs routes

  test('it should retreive a list of jobs in the database', async function () {
    // await db.query(`INSERT INTO jobs
    //   (title, salary, equity, company_handle, date_posted)
    //   Values ('newer', 1000.00, 0, 'SBUX', 2019-05-09 16:34:42.446803`);
    const res = await request(app).get('/jobs');
    const expRes = {
      jobs: [
        {
          title: 'tester',
          "company_handle": 'SBUX'
        }
      ]
    };

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('it should be searchable', async function () {
    const res = await request(app).get('/jobs?search=tester');
    const expRes = {
      jobs: [
        {
          title: 'tester',
          "company_handle": 'SBUX'
        }
      ]
    };

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('it should retreive a filtered list of jobs in the database', async function () {
    const res = await request(app).get('/jobs?min_equity=50');
    const expRes = {
      jobs: []
    };

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expRes);
  });

  test('it should retreive a specified job from the DB', async function () {
    const res = await request(app).get('/jobs/1');
    const expRes = {
      job:
      {
        "id": 1,
        "title": "tester",
        "salary": 1000.00,
        "equity": 0.01,
        "company_handle": "SBUX",
        "date_posted": testDate
      },
      company: {
        handle: 'SBUX',
        name: 'Starbucks',
        num_employees: 100000,
        description: 'seattle based coffee company, we burn our coffee often, includes sugar',
        logo_url: 'https://starbucks.com/logo.jpg'
      }
    };

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('job');
    expect(res.body.job).toHaveProperty('date_posted');
    expect(res.body.job).toHaveProperty('salary', 1000);
    // expect(res.body.job).toHaveProperty('date_posted');
    // expect(res.body.job).toHaveProperty('date_posted');
  });

  // TODO: test querystring search on GET req

  test('it should send error when trying to retreive job not in DB', async function () {
    const res = await request(app).get('/jobs/20');

    expect(res.statusCode).toBe(404);
  });
});


describe('POST /jobs', function () {
  // testing POST rquests for /jobs route

  test('it should add a job to the database', async function () {
    const chemist = {
      "title": "Chemist",
      "salary": 10500.00,
      "equity": 0.00,
      "company_handle": "SBUX"
    };
    const res = await request(app)
      .post('/jobs')
      .send(chemist);
    expect(res.statusCode).toBe(201);
    expect(res.body.job).toHaveProperty('title', "Chemist");
    expect(res.body.job).toHaveProperty('salary');
    expect(res.body.job).toHaveProperty('equity');
    expect(res.body.job).toHaveProperty('company_handle');

    let getAll = await db.query(`select * from jobs`);
    expect(getAll.rows).toHaveLength(2);
  });

  test(`it should throw an error when not provided title, salary, equity`, async function () {
    const chemist = {
      "title": "Chemist",
      "salary": 10500.00,
      "company_handle": "SBUX",
      "date_posted": testDate
    };
    const res = await request(app)
      .post('/jobs')
      .send(chemist);
    expect(res.statusCode).toBe(400);
    // expect(res.body).toEqual({company: philz});
  });

  test(`it should throw an error when company_handle does not exist`, async function () {
    const barrista = {
      "title": "barrista",
      "salary": 500.00,
      "equity": 0.00,
      "company_handle": "PHILZ",
      "date_posted": testDate
    };
    const res = await request(app)
      .post('/jobs')
      .send(barrista);
    expect(res.statusCode).toBe(400);
    // expect(res.body).toEqual({company: philz});
  });
});


describe('PATCH /jobs', function () {
  // testing PATCH rquests for /jobs route

  test('it should update a job in the database', async function () {
    const body = {
      "id": 1,
      "title": "tester",
      "salary": 9000.00,
      "equity": 1.00,
      "company_handle": "SBUX",
      "date_posted": testDate
    };
    const res = await request(app)
      .patch('/jobs/1')
      .send(body);
    expect(res.statusCode).toBe(200);
    expect(res.body.job).toHaveProperty('title', "tester");
    expect(res.body.job).toHaveProperty('salary');
    expect(res.body.job).toHaveProperty('equity');
    expect(res.body.job).toHaveProperty('company_handle', 'SBUX');
  });

  test('it should throw an error when trying to update job not in DB', async function () {
    const body = {
      "id": 4,
      "title": "assasin",
      "salary": 100000.00,
      "equity": 100.00,
      "company_handle": "SBUX",
      "date_posted": testDate
    };
    const res = await request(app)
      .patch('/jobs/4')
      .send(body);
    expect(res.statusCode).toBe(404);
  });

});


describe('DELETE /jobs', function () {
  // testing DELETE rquests for /jobs route

  test('it should delete a job from the database', async function () {
    const res = await request(app)
      .delete('/jobs/1');
    expect(res.statusCode).toBe(200);
    let getAll = await db.query(`select * from jobs`);
    expect(getAll.rows).toHaveLength(0);
  });

  test('it should throw an error when trying to delete job not in DB', async function () {
    const res = await request(app)
      .delete('/jobs/4');
    expect(res.statusCode).toBe(404);
  });

});
