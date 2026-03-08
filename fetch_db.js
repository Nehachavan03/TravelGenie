const db = require('./backend/db.js');
db.query('SELECT * FROM countries', (err, res) => {
    const fs = require('fs');
    fs.writeFileSync('countries.json', JSON.stringify(res, null, 2));
    db.query('SELECT * FROM cities', (err, res2) => {
        fs.writeFileSync('cities.json', JSON.stringify(res2, null, 2));
        process.exit(0);
    });
});
