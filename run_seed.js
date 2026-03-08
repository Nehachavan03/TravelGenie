const db = require('./backend/db.js');
const fs = require('fs');

async function runSQLFile(filepath) {
    const sql = fs.readFileSync(filepath, 'utf8');
    // Simple split by ; isn't perfect for all SQL, but it works for basic schema/inserts without triggers
    const queries = sql.split(';').filter(q => q.trim().length > 0);

    for (let q of queries) {
        if (q.trim()) {
            await new Promise((resolve, reject) => {
                db.query(q, (err) => {
                    if (err) {
                        console.error('Error in query:', q.substring(0, 100) + '...');
                        console.error(err.message);
                        // Ignore IF NOT EXISTS or DROP TABLE IF EXISTS errors
                    }
                    resolve();
                });
            });
        }
    }
}

async function main() {
    console.log("Running schema...");
    await runSQLFile('../database/schema.sql');
    console.log("Running seed data...");
    await runSQLFile('../database/seed_data_comprehensive.sql');
    console.log('Finished fully provisioning DB.');
    process.exit(0);
}

main();
