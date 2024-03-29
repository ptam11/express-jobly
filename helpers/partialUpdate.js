/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: an object with keys of columns you want to update and values with
 *          updated values
 * - key: the column that we query by (e.g. username, handle, id)
 * - id: current record ID
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be updated
 *
 */

function sqlForPartialUpdate(table, items, targetKey, id) {
  let idx = 1;
  let columns = [];

  // filter out keys that start with "_" -- we don't want these in DB
  for (let key in items) {
    if (key.startsWith("_") || key === 'id') {
      delete items[key];
    }
  }
  for (let column in items) {
    columns.push(`${column}=$${idx}`);
    idx += 1;
  }
  // build query
  let cols = columns.join(", ");
  // prone to SQL injection, needs to be paramterized refactor later
  let query = `UPDATE ${table} SET ${cols} WHERE ${targetKey}=$${idx} RETURNING *`;

  let values = Object.values(items);
  values.push(id);

  return { query, values };
}

module.exports = sqlForPartialUpdate;
