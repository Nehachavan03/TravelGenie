/**
 * generate_huge_seed.js
 * FIXED for EXACT 15 Countries, 3 Cities each, 5 Places each
 */

require('dotenv').config({ path: '.env' });
const db = require('./db');

const countries = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'IT', name: 'Italy' },
    { code: 'DE', name: 'Germany' },
    { code: 'ES', name: 'Spain' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'BR', name: 'Brazil' },
    { code: 'CN', name: 'China' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SG', name: 'Singapore' },
];

const citiesData = {
    IN: ['Mumbai', 'Delhi', 'Jaipur'],
    US: ['New York', 'Los Angeles', 'Chicago'],
    UK: ['London', 'Edinburgh', 'Manchester'],
    FR: ['Paris', 'Nice', 'Lyon'],
    DE: ['Berlin', 'Munich', 'Hamburg'],
    JP: ['Tokyo', 'Kyoto', 'Osaka'],
    IT: ['Rome', 'Venice', 'Florence'],
    ES: ['Barcelona', 'Madrid', 'Seville'],
    CA: ['Toronto', 'Vancouver', 'Montreal'],
    AU: ['Sydney', 'Melbourne', 'Gold Coast'],
    BR: ['Rio de Janeiro', 'Sao Paulo', 'Salvador'],
    CN: ['Beijing', 'Shanghai', 'Xi\'an'],
    AE: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    CH: ['Zurich', 'Lucerne', 'Geneva'],
    SG: ['Singapore City', 'Sentosa', 'Marina Bay'],
};

const categoryNames = ['Historical', 'Museum', 'Experience', 'Nature', 'Dining', 'Shopping', 'Theme Parks', 'Entertainment'];

const placesTemplates = {
    'Historical': [
        { name: 'Heritage Fort', desc: 'A majestic fort offering a glimpse into the royal past.' },
        { name: 'Ancient Temple', desc: 'Stunning spiritual architecture from centuries ago.' }
    ],
    'Museum': [
        { name: 'National Museum', desc: 'Home to rare artifacts and cultural treasures.' }
    ],
    'Experience': [
        { name: 'Cultural Show Center', desc: 'Enjoy live performances of traditional music and dance.' }
    ],
    'Nature': [
        { name: 'Botanical Garden', desc: 'A lush green escape with exotic plants and flowers.' }
    ],
    'Dining': [
        { name: 'Gourmet Restaurant', desc: 'An exquisite culinary experience with world-class chefs.' },
        { name: 'Traditional Eatery', desc: 'Local flavors served in a cozy, authentic setting.' }
    ],
    'Shopping': [
        { name: 'Grand Bazaar', desc: 'Find unique local handicrafts and exotic spices.' }
    ],
    'Theme Parks': [
        { name: 'Wonderland Adventure', desc: 'Thrilling rides and fun activities for the whole family.' },
        { name: 'Water Splash Park', desc: 'Exciting slides and wave pools for a sunny day.' }
    ],
    'Entertainment': [
        { name: 'City Opera House', desc: 'World-class performances in a stunning venue.' }
    ]
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

async function seed() {
    try {
        console.log('--- Starting Final Seeding Process ---');

        await query('SET FOREIGN_KEY_CHECKS = 0');
        console.log('Cleaning existing data...');
        await query('TRUNCATE TABLE reviews');
        await query('TRUNCATE TABLE favorites');
        await query('TRUNCATE TABLE itinerary_details');
        await query('TRUNCATE TABLE itineraries');
        await query('TRUNCATE TABLE places');
        await query('TRUNCATE TABLE cities');
        await query('TRUNCATE TABLE countries');
        await query('TRUNCATE TABLE categories');
        await query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Seeding categories...');
        const categoryMap = {};
        for (const name of categoryNames) {
            const result = await query('INSERT INTO categories (category_name) VALUES (?)', [name]);
            categoryMap[name] = result.insertId;
        }

        console.log('Seeding 15 countries...');
        for (const country of countries) {
            await query('INSERT INTO countries (country_code, country_name) VALUES (?, ?)', [country.code, country.name]);
        }

        let totalCities = 0;
        let totalPlaces = 0;

        for (const country of countries) {
            console.log(`Seeding 3 cities for ${country.name}...`);
            const targetCities = citiesData[country.code];

            for (const cityName of targetCities) {
                const pincode = Math.floor(100000 + Math.random() * 900000).toString();
                const cityResult = await query(
                    'INSERT INTO cities (name, pincode, country_code) VALUES (?, ?, ?)',
                    [cityName, pincode, country.code]
                );
                const cityId = cityResult.insertId;
                totalCities++;

                // EXACTLY 5 places per city with a fixed mix
                const mix = ['Dining', 'Theme Parks', 'Historical', 'Nature', 'Shopping'];
                for (let i = 0; i < 5; i++) {
                    const catName = mix[i];
                    const templates = placesTemplates[catName];
                    const template = templates[getRandomInt(0, templates.length - 1)];

                    const placeName = `${cityName} ${template.name}`;
                    const description = `${template.desc} Located in the heart of ${cityName}.`;
                    const address = `${getRandomInt(10, 999)}, ${template.name.split(' ').pop()} St, ${cityName}`;

                    await query(
                        'INSERT INTO places (city_id, name, description, address, category_id) VALUES (?, ?, ?, ?, ?)',
                        [cityId, placeName, description, address, categoryMap[catName]]
                    );
                    totalPlaces++;
                }
            }
        }

        console.log('\n--- Final Seeding Completed Successfully! ---');
        console.log(`Summary:`);
        console.log(`- Countries: ${countries.length}`);
        console.log(`- Cities: ${totalCities}`);
        console.log(`- Places: ${totalPlaces}`);

    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        process.exit();
    }
}

seed();
