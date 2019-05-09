const sqlForPartialUpdate = require("../../helpers/partialUpdate");


describe("partialUpdate()", () => {
  it("should generate proper partial update query with 1 field", function () {
    const {query, values} = sqlForPartialUpdate(
      "companies",
      {name: "Test"},
      "description",
      "test description"
    );

    expect(query).toEqual(
      "UPDATE companies SET name=$1 WHERE description=$2 RETURNING *"
    );

    expect(values).toEqual(["Test", "test description"]);
  });
});
