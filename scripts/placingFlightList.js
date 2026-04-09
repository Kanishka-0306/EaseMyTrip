// ===== ELEMENT REFERENCE =====
const flightBookBox = document.getElementById('flightBookBox');

// ===== EMBEDDED CSS =====
const style = document.createElement('style');
style.innerHTML = `
#flightBookBox { max-width: 900px; margin: 20px auto; font-family: Arial, sans-serif; }
.flightCard { display: grid; grid-template-columns: 130px 145px 160px 110px 80px 120px; align-items: center; padding: 12px 16px; gap: 10px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff; box-shadow: 0px 2px 5px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; margin-bottom: 12px; font-size: 13px; }
.flightCard:hover { transform: scale(1.01); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.airlineInfo { display: flex; align-items: center; gap: 10px; }
.airlineInfo img { width: 40px; height: 40px; object-fit: contain; border-radius: 4px; }
.airlineInfo span { font-size: 13px; font-weight: 500; }
.flightPrice { font-size: 14px; font-weight: 500; text-align: right; color: #FF6B00; }
.flightButton button { background-color: #FF6B00; color: #fff; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 13px; transition: background-color 0.2s; }
.flightButton button:hover { background-color: #e05500; }
.no-flights { text-align: center; padding: 40px; color: #666; font-size: 16px; }
.loading { text-align: center; padding: 40px; color: #1853A2; font-size: 16px; }
.search-info { background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; border-left: 4px solid #1853A2; }
.search-info strong { color: #1853A2; }
`;
document.head.appendChild(style);

const API_URL = 'http://localhost:5005';

// Helper function to extract city name from "City (CODE)" format
function extractCityName(cityString) {
    if (!cityString) return '';
    const match = cityString.match(/^([^(]+)/);
    return match ? match[1].trim().toLowerCase() : cityString.trim().toLowerCase();
}

// Helper function to calculate duration
function calculateDuration(takeoff, landing) {
    if (!takeoff || !landing) return 'N/A';
    
    const [tHour, tMin] = takeoff.split(':').map(Number);
    const [lHour, lMin] = landing.split(':').map(Number);
    
    let tTotal = tHour * 60 + tMin;
    let lTotal = lHour * 60 + lMin;
    
    if (lTotal < tTotal) lTotal += 24 * 60;
    
    const diff = lTotal - tTotal;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    
    return `${hours}h ${mins}m`;
}

// Client-side filtering
function filterFlights(flights, searchData) {
    if (!searchData.from && !searchData.to && !searchData.depart) {
        return flights;
    }

    const fromCity = extractCityName(searchData.from);
    const toCity = extractCityName(searchData.to);
    const departDate = searchData.depart;

    console.log('🔍 Filtering with:', { fromCity, toCity, departDate });

    return flights.filter(flight => {
        const flightSource = (flight.source || '').toLowerCase().trim();
        const flightDest = (flight.destination || '').toLowerCase().trim();
        const flightDate = flight.journey_date;

        let matchSource = !fromCity || flightSource.includes(fromCity) || fromCity.includes(flightSource);
        let matchDest = !toCity || flightDest.includes(toCity) || toCity.includes(flightDest);
        let matchDate = !departDate || flightDate === departDate;

        return matchSource && matchDest && matchDate;
    });
}

// Get correct logo path for booking page
function getLogoPathForBooking(airlineName, dbLogoPath) {
    // If database has a logo path, use it with correct relative path
    if (dbLogoPath && dbLogoPath.trim() !== '') {
        // Remove any existing '../' or 'icons/' prefix
        let cleanPath = dbLogoPath.replace(/^\.\.\//, '').replace(/^icons\//, '');
        // Return path that works from Bookflight folder
        return `../icons/${cleanPath}`;
    }
    
    // Default logos based on airline name
    const airline = (airlineName || '').toLowerCase();
    if (airline.includes('indigo')) return '../icons/indigo.jpg';
    if (airline.includes('air india') || airline.includes('airindia')) return '../icons/airindia.jpg';
    if (airline.includes('vistara')) return '../icons/vistara.png';
    if (airline.includes('spice')) return '../icons/spicejet.png';
    if (airline.includes('go first') || airline.includes('gofirst')) return '../icons/gofirst.png';
    return '../icons/airline.png';
}

// Get logo path for display on search page
function getLogoPathForDisplay(airlineName, dbLogoPath) {
    // If database has a logo path
    if (dbLogoPath && dbLogoPath.trim() !== '') {
        let cleanPath = dbLogoPath.replace(/^\.\.\//, '').replace(/^icons\//, '');
        return `icons/${cleanPath}`;
    }
    
    // Default logos
    const airline = (airlineName || '').toLowerCase();
    if (airline.includes('indigo')) return 'icons/indigo.jpg';
    if (airline.includes('air india') || airline.includes('airindia')) return 'icons/airindia.jpg';
    if (airline.includes('vistara')) return 'icons/vistara.png';
    if (airline.includes('spice')) return 'icons/spicejet.png';
    if (airline.includes('go first') || airline.includes('gofirst')) return 'icons/gofirst.png';
    return 'icons/airline.png';
}

// Fetch ALL flights from backend
async function fetchFlights() {
    try {
        const searchData = JSON.parse(localStorage.getItem("searchQuery")) || {};
        
        console.log("🔍 Search Data:", searchData);
        
        const url = `${API_URL}/flights`;
        console.log('📡 Fetching flights from:', url);
        
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const allFlights = await res.json();
        console.log('✅ Total flights in database:', allFlights.length);
        
        // Client-side filtering
        const filteredFlights = filterFlights(allFlights, searchData);
        console.log('🎯 Matching flights:', filteredFlights.length);
        
        return filteredFlights;
        
    } catch (err) {
        console.error('❌ Error fetching flights:', err);
        alert('⚠️ Failed to load flights. Please ensure backend is running at http://localhost:5005');
        return [];
    }
}

function renderFlights(flights) {
    flightBookBox.innerHTML = '';
    
    // Show search info
    const searchData = JSON.parse(localStorage.getItem("searchQuery")) || {};
    if (searchData.from || searchData.to || searchData.depart) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'search-info';
        infoDiv.innerHTML = `
            <strong>🔍 Search Results:</strong> 
            ${searchData.from ? `<strong>From:</strong> ${searchData.from}` : ''} 
            ${searchData.to ? `→ <strong>To:</strong> ${searchData.to}` : ''} 
            ${searchData.depart ? `📅 <strong>Date:</strong> ${searchData.depart}` : ''}
            ${flights.length > 0 ? `<span style="float: right; color: green;">✓ ${flights.length} flights found</span>` : ''}
        `;
        flightBookBox.appendChild(infoDiv);
    }
    
    if (!flights || flights.length === 0) {
        const noFlightDiv = document.createElement('div');
        noFlightDiv.className = 'no-flights';
        noFlightDiv.innerHTML = `
            <i class="fas fa-plane-slash" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
            <h3>😔 No Flights Found</h3>
            <p>No flights available matching your search criteria.</p>
            <p style="margin-top: 15px; font-size: 14px; color: #999;">
                <strong>Try:</strong><br>
                • Different dates or destinations<br>
                • Search without date filter<br>
                • Contact admin to add flights
            </p>
            <button onclick="window.location.href='index.html'" 
                    style="margin-top: 20px; padding: 10px 20px; background: #1853A2; color: white; border: none; border-radius: 5px; cursor: pointer;">
                🏠 Back to Home
            </button>
        `;
        flightBookBox.appendChild(noFlightDiv);
        return;
    }

    console.log(`✈️ Rendering ${flights.length} flights...`);

    flights.forEach((flight, idx) => {
        const card = document.createElement('div');
        card.className = 'flightCard';

        // Get logo paths - one for display, one for booking
        const displayLogoPath = getLogoPathForDisplay(flight.airline_name, flight.airline_logo);
        const bookingLogoPath = getLogoPathForBooking(flight.airline_name, flight.airline_logo);

        const depart = flight.takeoff_time || '';
        const arrive = flight.landing_time || '';
        const duration = flight.duration || calculateDuration(depart, arrive);
        const price = flight.price || flight.basePrice || 0;

        card.innerHTML = `
            <div class="airlineInfo">
                <img src="${displayLogoPath}" 
                     alt="${flight.airline_name}"
                     onerror="this.src='icons/airline.png'">
                <span>${flight.airline_name || 'Unknown Airline'}</span>
            </div>
            <div style="font-weight: 600; color: #333;">${depart}</div>
            <div style="color: #666; text-align: center;">${duration}</div>
            <div style="font-weight: 600; color: #333;">${arrive}</div>
            <div class="flightPrice">₹${price}</div>
            <div class="flightButton">
                <button id="book${idx}">Book Now</button>
            </div>
        `;
        flightBookBox.appendChild(card);

        // BOOK NOW BUTTON
        document.getElementById(`book${idx}`).addEventListener('click', () => {
            const searchData = JSON.parse(localStorage.getItem("searchQuery")) || {};
            
            const bookingData = {
                flight: {
                    _id: flight._id,
                    airline_name: flight.airline_name || flight.airline,
                    airline_logo: bookingLogoPath, // ✅ Correct path for booking page
                    price: price,
                    takeoff_time: depart,
                    landing_time: arrive,
                    duration: duration,
                    source: flight.source || extractCityName(searchData.from) || "From City",
                    destination: flight.destination || extractCityName(searchData.to) || "To City",
                    journey_date: flight.journey_date || searchData.depart || new Date().toISOString().split('T')[0],
                    aircraft_code: flight.aircraft_code || 'NA',
                    aircraft_number: flight.aircraft_number || Math.floor(1000 + Math.random() * 9000),
                    travellers: searchData.travellers || 1,
                    flight_class: flight.flight_class || searchData.flightClass || "Economy"
                }
            };
            
            console.log("💾 Storing booking data with logo:", bookingLogoPath);
            localStorage.setItem("bookingDetailOfUser", JSON.stringify(bookingData));
            window.location.href = "Bookflight/bookflight.html";
        });
    });
}

// Show loading
flightBookBox.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> ⏳ Loading flights from database...</div>';

// Main execution
fetchFlights()
    .then(flights => {
        console.log('🎬 Rendering flights...');
        renderFlights(flights);
    })
    .catch(err => {
        console.error('💥 Error:', err);
        flightBookBox.innerHTML = `
            <div class="no-flights">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff6b6b; margin-bottom: 15px;"></i>
                <h3>⚠️ Cannot Load Flights</h3>
                <p>Unable to connect to server</p>
                <p style="margin-top: 15px; font-size: 14px; color: #999;">
                    <strong>Please check:</strong><br>
                    • Backend server running: <code>node server.js</code><br>
                    • Server at: http://localhost:5005<br>
                    • MongoDB is connected
                </p>
                <button onclick="location.reload()" 
                        style="margin-top: 20px; padding: 10px 20px; background: #1853A2; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🔄 Retry
                </button>
            </div>
        `;
    });