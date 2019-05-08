// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');
const { createData } = require('../../_test-common');
const db = require('../../db');

beforeEach(createData);

afterAll(function() {
	db.end();
});

describe('GET /companies', function() {
	// testing GET rquests for /companies routes

	test('it should retreive a list of companies in the database', async function() {
		const res = await request(app).get('/companies');
		const expRes = {
			companies: [
				{
					handle: 'SBUX',
					name: 'Starbucks'
				}
			]
		};

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(expRes);
	});

	test('it should retreive a list of companies in the database', async function() {
		const res = await request(app).get('/companies?search=Starbucks');
		const expRes = {
			companies: [
				{
					handle: 'SBUX',
					name: 'Starbucks'
				}
			]
		};

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(expRes);
	});

	test('it should retreive a filtered list of companies in the database', async function() {
		const res = await request(app).get('/companies?max_employees=2');
		const expRes = {
			companies: []
		};

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(expRes);
	});

	test('it should retreive a specified company from the DB', async function() {
		const res = await request(app).get('/companies/SBUX');
		const expRes = {
			company: {
				handle: 'SBUX',
				name: 'Starbucks',
				num_employees: 100000,
				description: 'seattle based coffee company, we burn our coffee often, includes sugar',
				logo_url: 'https://starbucks.com/logo.jpg'
			}
		};

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(expRes);
	});

	// TODO: test querystring search on GET req

	test('it should send error when trying to retreive company not in DB', async function() {
		const res = await request(app).get('/companies/LOLNO');

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
        }
        const res = await request(app)
            .post('/companies')
            .send(philz)
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({company: philz});
		let getAll = await db.query(`select * from companies`)
        expect(getAll.rows).toHaveLength(2);
	});

	test(`it should throw an error when not provided name & handle`, async function() {
        const philz = {
            name: 'Philz',
            num_employees: 1000,
            description: 'SF based coffee company, makes infinitely better coffee than SBUX',
            logo_url: 'https://philz.com/logo.jpg'
        }
        const res = await request(app)
            .post('/companies')
            .send(philz)
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
        }
        const res = await request(app)
            .patch('/companies/SBUX')
            .send(body)
		expect(res.statusCode).toBe(200);
		body.handle = 'SBUX';
		expect(res.body).toEqual({company: body});
	});

	test('it should throw an error when trying to update company not in DB', async function() {
        const body = {
            name: 'sTaRbUcKs',
            num_employees: 0,
            description: 'lol make better coffee',
            logo_url: 'https://booooooooo.com/logo.jpg'
        }
        const res = await request(app)
            .patch('/companies/w00t')
            .send(body)
		expect(res.statusCode).toBe(404);
	});

});


describe('DELETE /companies', function() {
	// testing DELETE rquests for /companies route

	test('it should delete a company from the database', async function() {
        const res = await request(app)
            .delete('/companies/SBUX')
		expect(res.statusCode).toBe(200);
		let getAll = await db.query(`select * from companies`)
        expect(getAll.rows).toHaveLength(0);
	});

	test('it should throw an error when trying to delete company not in DB', async function() {
        const res = await request(app)
            .delete('/companies/w00t');
		expect(res.statusCode).toBe(404);
	});

});
