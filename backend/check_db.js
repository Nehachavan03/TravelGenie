const db = require('./db');
db.query('SELECT * FROM countries', (err, countries) => {
    db.query('SELECT * FROM cities', (err, cities) => {
        db.query('SELECT * FROM places', (err, places) => {
            console.log("Countries:", JSON.stringify(countries, null, 2));
            console.log(`Total Cities: ${cities.length}, Total Places: ${places.length}`);
            process.exit(0);
        });
    });
});
