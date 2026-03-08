const db = require('./db');
const util = require('util');

const query = util.promisify(db.query).bind(db);

const seedData = [
    {
        code: 'ES', name: 'Spain', cities: [
            { name: 'Barcelona', places: [{ name: 'Sagrada Familia', desc: 'Gaudi masterpiece' }, { name: 'Park Güell', desc: 'Iconic public park' }, { name: 'Casa Batlló', desc: 'Modernist building' }] },
            { name: 'Madrid', places: [{ name: 'Prado Museum', desc: 'National Spanish art museum' }, { name: 'Royal Palace', desc: 'Official residence' }, { name: 'Retiro Park', desc: 'Expansive gardens' }] },
            { name: 'Seville', places: [{ name: 'Alcázar', desc: 'Royal palace' }, { name: 'Plaza de España', desc: 'Landmark square' }, { name: 'Seville Cathedral', desc: 'Gothic cathedral' }] },
            { name: 'Valencia', places: [{ name: 'City of Arts and Sciences', desc: 'Cultural complex' }, { name: 'Malvarrosa Beach', desc: 'Popular beach' }, { name: 'Central Market', desc: 'Public market' }] },
            { name: 'Granada', places: [{ name: 'Alhambra', desc: 'Moorish palace' }, { name: 'Generalife', desc: 'Palace gardens' }, { name: 'Albaicín', desc: 'Historic quarter' }] }
        ]
    },
    {
        code: 'GB', name: 'United Kingdom', cities: [
            { name: 'London', places: [{ name: 'Big Ben', desc: 'Clock tower' }, { name: 'Tower of London', desc: 'Historic castle' }, { name: 'London Eye', desc: 'Observation wheel' }] },
            { name: 'Edinburgh', places: [{ name: 'Edinburgh Castle', desc: 'Historic fortress' }, { name: 'Arthur Seat', desc: 'Ancient volcano' }, { name: 'Royal Mile', desc: 'Historic street' }] },
            { name: 'Manchester', places: [{ name: 'Old Trafford', desc: 'Football stadium' }, { name: 'Science Museum', desc: 'Interactive exhibits' }, { name: 'John Rylands Library', desc: 'Gothic library' }] },
            { name: 'Bath', places: [{ name: 'Roman Baths', desc: 'Ancient bathing complex' }, { name: 'Bath Abbey', desc: 'Anglican parish church' }, { name: 'Royal Crescent', desc: 'Historic houses' }] },
            { name: 'Liverpool', places: [{ name: 'Albert Dock', desc: 'Historic dock' }, { name: 'The Beatles Story', desc: 'Museum' }, { name: 'Liverpool Cathedral', desc: 'Anglican cathedral' }] }
        ]
    },
    {
        code: 'AU', name: 'Australia', cities: [
            { name: 'Sydney', places: [{ name: 'Sydney Opera House', desc: 'Performing arts centre' }, { name: 'Bondi Beach', desc: 'Famous beach' }, { name: 'Harbour Bridge', desc: 'Iconic bridge' }] },
            { name: 'Melbourne', places: [{ name: 'Federation Square', desc: 'Cultural precinct' }, { name: 'Royal Botanic Gardens', desc: 'Large gardens' }, { name: 'Queen Victoria Market', desc: 'Historic market' }] },
            { name: 'Brisbane', places: [{ name: 'South Bank', desc: 'Cultural area' }, { name: 'Lone Pine Sanctuary', desc: 'Koala sanctuary' }, { name: 'Story Bridge', desc: 'Heritage bridge' }] },
            { name: 'Perth', places: [{ name: 'Kings Park', desc: 'Large city park' }, { name: 'Cottesloe Beach', desc: 'Beautiful beach' }, { name: 'Fremantle Prison', desc: 'Historic site' }] },
            { name: 'Adelaide', places: [{ name: 'Adelaide Central Market', desc: 'Bustling market' }, { name: 'Art Gallery', desc: 'State collection' }, { name: 'Glenelg Beach', desc: 'Popular beach' }] }
        ]
    },
    {
        code: 'BR', name: 'Brazil', cities: [
            { name: 'Rio de Janeiro', places: [{ name: 'Christ the Redeemer', desc: 'Iconic statue' }, { name: 'Copacabana', desc: 'Famous beach' }, { name: 'Sugarloaf Mountain', desc: 'Cable car views' }] },
            { name: 'São Paulo', places: [{ name: 'Paulista Avenue', desc: 'Bustling street' }, { name: 'Ibirapuera Park', desc: 'Major urban park' }, { name: 'MASP', desc: 'Art museum' }] },
            { name: 'Salvador', places: [{ name: 'Pelourinho', desc: 'Historic center' }, { name: 'Elevador Lacerda', desc: 'Art Deco elevator' }, { name: 'Farol da Barra', desc: 'Historic lighthouse' }] },
            { name: 'Brasília', places: [{ name: 'Cathedral of Brasília', desc: 'Modern cathedral' }, { name: 'Three Powers Plaza', desc: 'Government center' }, { name: 'Itamaraty Palace', desc: 'Architecture' }] },
            { name: 'Fortaleza', places: [{ name: 'Praia do Futuro', desc: 'Beach zone' }, { name: 'Dragão do Mar', desc: 'Cultural center' }, { name: 'Beira Mar', desc: 'Coastal avenue' }] }
        ]
    },
    {
        code: 'CA', name: 'Canada', cities: [
            { name: 'Toronto', places: [{ name: 'CN Tower', desc: 'Observation tower' }, { name: 'Royal Ontario Museum', desc: 'Major museum' }, { name: 'Ripley Aquarium', desc: 'Large aquarium' }] },
            { name: 'Vancouver', places: [{ name: 'Stanley Park', desc: 'Urban park' }, { name: 'Capilano Suspension Bridge', desc: 'Bridge over river' }, { name: 'Granville Island', desc: 'Market area' }] },
            { name: 'Montreal', places: [{ name: 'Mount Royal', desc: 'Hill in city' }, { name: 'Old Montreal', desc: 'Historic area' }, { name: 'Notre-Dame Basilica', desc: 'Gothic revival church' }] },
            { name: 'Quebec City', places: [{ name: 'Château Frontenac', desc: 'Grand hotel' }, { name: 'Old Quebec', desc: 'Historic neighborhood' }, { name: 'Montmorency Falls', desc: 'Large waterfall' }] },
            { name: 'Calgary', places: [{ name: 'Calgary Tower', desc: 'Observation deck' }, { name: 'Calgary Stampede', desc: 'Rodeo event' }, { name: 'Heritage Park', desc: 'Historical village' }] }
        ]
    },
    {
        code: 'AE', name: 'United Arab Emirates', cities: [
            { name: 'Dubai', places: [{ name: 'Burj Khalifa', desc: 'Tallest building' }, { name: 'Dubai Mall', desc: 'Massive mall' }, { name: 'Palm Jumeirah', desc: 'Artificial island' }] },
            { name: 'Abu Dhabi', places: [{ name: 'Sheikh Zayed Mosque', desc: 'Grand mosque' }, { name: 'Louvre Abu Dhabi', desc: 'Art museum' }, { name: 'Ferrari World', desc: 'Theme park' }] },
            { name: 'Sharjah', places: [{ name: 'Museum of Islamic Civilization', desc: 'Museum' }, { name: 'Al Noor Island', desc: 'Nature park' }, { name: 'Sharjah Aquarium', desc: 'Maritime center' }] },
            { name: 'Ras Al Khaimah', places: [{ name: 'Jebel Jais', desc: 'Mountain peak' }, { name: 'Al Hamra Village', desc: 'Resort area' }, { name: 'National Museum', desc: 'History museum' }] },
            { name: 'Fujairah', places: [{ name: 'Fujairah Fort', desc: 'Historic fort' }, { name: 'Al Aqah Beach', desc: 'Sandy beach' }, { name: 'Snoopy Island', desc: 'Snorkeling spot' }] }
        ]
    },
    {
        code: 'TH', name: 'Thailand', cities: [
            { name: 'Bangkok', places: [{ name: 'Grand Palace', desc: 'Royal residence' }, { name: 'Wat Arun', desc: 'Riverside temple' }, { name: 'Chatuchak Market', desc: 'Weekend market' }] },
            { name: 'Chiang Mai', places: [{ name: 'Doi Suthep', desc: 'Mountain temple' }, { name: 'Elephant Nature Park', desc: 'Sanctuary' }, { name: 'Night Bazaar', desc: 'Shopping area' }] },
            { name: 'Phuket', places: [{ name: 'Patong Beach', desc: 'Lively beach' }, { name: 'Big Buddha', desc: 'Large landmark' }, { name: 'Phi Phi Islands', desc: 'Boat tour' }] },
            { name: 'Pattaya', places: [{ name: 'Sanctuary of Truth', desc: 'Wooden temple' }, { name: 'Walking Street', desc: 'Nightlife area' }, { name: 'Nong Nooch', desc: 'Botanical garden' }] },
            { name: 'Krabi', places: [{ name: 'Railay Beach', desc: 'Scenic shores' }, { name: 'Tiger Cave Temple', desc: 'Spiritual site' }, { name: 'Emerald Pool', desc: 'Natural spring' }] }
        ]
    },
    {
        code: 'GR', name: 'Greece', cities: [
            { name: 'Athens', places: [{ name: 'Acropolis', desc: 'Ancient citadel' }, { name: 'Parthenon', desc: 'Iconic temple' }, { name: 'Plaka', desc: 'Historic neighborhood' }] },
            { name: 'Thessaloniki', places: [{ name: 'White Tower', desc: 'Monument' }, { name: 'Aristotelous Square', desc: 'City center' }, { name: 'Archaeological Museum', desc: 'History museum' }] },
            { name: 'Santorini', places: [{ name: 'Oia', desc: 'Cliffside village' }, { name: 'Fira', desc: 'Capital town' }, { name: 'Red Beach', desc: 'Volcanic sand beach' }] },
            { name: 'Heraklion', places: [{ name: 'Knossos Palace', desc: 'Minoan ruins' }, { name: 'Archaeological Museum', desc: 'Ancient artifacts' }, { name: 'Koules Fortress', desc: 'Venetian castle' }] },
            { name: 'Rhodes', places: [{ name: 'Palace of the Grand Master', desc: 'Medieval castle' }, { name: 'Lindos Acropolis', desc: 'Ancient site' }, { name: 'Old Town', desc: 'Historic streets' }] }
        ]
    },
    {
        code: 'MX', name: 'Mexico', cities: [
            { name: 'Mexico City', places: [{ name: 'Zócalo', desc: 'Main square' }, { name: 'Chapultepec Castle', desc: 'Historic palace' }, { name: 'Frida Kahlo Museum', desc: 'Art museum' }] },
            { name: 'Cancún', places: [{ name: 'Chichén Itzá', desc: 'Mayan ruins' }, { name: 'Isla Mujeres', desc: 'Island getaway' }, { name: 'Xcaret', desc: 'Eco-archaeological park' }] },
            { name: 'Guadalajara', places: [{ name: 'Hospicio Cabañas', desc: 'Cultural institute' }, { name: 'Guadalajara Cathedral', desc: 'Iconic church' }, { name: 'Tlaquepaque', desc: 'Artisan market' }] },
            { name: 'Monterrey', places: [{ name: 'Macroplaza', desc: 'Large town square' }, { name: 'Fundidora Park', desc: 'Urban park' }, { name: 'Cerro de la Silla', desc: 'Mountain landmark' }] },
            { name: 'Oaxaca', places: [{ name: 'Monte Albán', desc: 'Zapotec ruins' }, { name: 'Santo Domingo', desc: 'Cultural center' }, { name: 'Hierve el Agua', desc: 'Natural rock formations' }] }
        ]
    },
    {
        code: 'CH', name: 'Switzerland', cities: [
            { name: 'Zurich', places: [{ name: 'Lake Zurich', desc: 'Scenic lake' }, { name: 'Old Town', desc: 'Historic area' }, { name: 'Kunsthaus', desc: 'Art museum' }] },
            { name: 'Geneva', places: [{ name: 'Jet d Eau', desc: 'Large fountain' }, { name: 'Palace of Nations', desc: 'UN headquarters' }, { name: 'St Pierre Cathedral', desc: 'Historic church' }] },
            { name: 'Lucerne', places: [{ name: 'Chapel Bridge', desc: 'Wooden bridge' }, { name: 'Lake Lucerne', desc: 'Glacial lake' }, { name: 'Lion Monument', desc: 'Rock relief' }] },
            { name: 'Bern', places: [{ name: 'Zytglogge', desc: 'Clock tower' }, { name: 'Federal Palace', desc: 'Parliament building' }, { name: 'Bear Pit', desc: 'Enclosure' }] },
            { name: 'Interlaken', places: [{ name: 'Jungfraujoch', desc: 'Alpine peak' }, { name: 'Harder Kulm', desc: 'Viewpoint' }, { name: 'Lake Brienz', desc: 'Turquoise lake' }] }
        ]
    }
];

async function seed() {
    try {
        for (const country of seedData) {
            // 1. Insert country
            console.log(`Inserting country: ${country.name}`);
            await query(`INSERT IGNORE INTO countries (country_code, country_name) VALUES (?, ?)`, [country.code, country.name]);

            for (const city of country.cities) {
                // 2. Insert city
                const cityInsert = await query(`INSERT INTO cities (name, pincode, country_code) VALUES (?, ?, ?)`, [city.name, '00000', country.code]);
                const cityId = cityInsert.insertId;

                // 3. Insert places
                for (const place of city.places) {
                    // Default to category_id 1 mostly
                    await query(`INSERT INTO places (city_id, name, description, address, category_id) VALUES (?, ?, ?, ?, ?)`,
                        [cityId, place.name, place.desc, `${place.name}, ${city.name}`, 1]);
                }
            }
        }
        console.log("Seeding complete successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
