process.env.NODE_ENV = "test"

const db = require('../../db');
const app = require('./app')
const { createData } = require('../../_test-common');

beforeEach(createData)

describe("partialUpdate()", () => {
  test("should generate a proper partial update query with just 1 field",
      async function () {

    // FIXME: write real tests!
    expect(false).toEqual(true);

  });
});
