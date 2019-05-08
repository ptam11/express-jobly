const db = require('./db');

async function createData() {
    await db.query("DELETE FROM companies");

    await db.query(`
        INSERT INTO companies (
            handle,
            name,
            num_employees,
            description,
            logo_url)
        VALUES ($1, $2, $3, $4, $5)
    `, [
        "SBUX",
        "Starbucks",
        "100000",
        "seattle based coffee company, we burn our coffee often, includes sugar",
        "https://starbucks.com/logo.jpg",
    ])
}

module.exports = {
    createData
}