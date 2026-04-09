// ===== ELEMENT REFERENCES =====
let from = document.getElementById('from');
let to = document.getElementById('to');
let depart = document.getElementById('departDate');
let arrive = document.getElementById('arriveDate');
let travellerCount = document.getElementById('travellerCount');
let travelClass = document.getElementById('flightClass');
let finalSearch = document.getElementById('finalSearch');
let swap = document.getElementById('swap');
let fromBox = document.getElementById('fromResults');
let toBox = document.getElementById('toResults');
let trip = "one";
let totalCount = 1;

// ===== TRAVELLER VARIABLES =====
let adult = 1, children = 0, infant = 0;

// ===== TRAVELLER ELEMENTS =====
const adultAdd = document.getElementById('adult_add');
const adultDel = document.getElementById('adult_del');
const childAdd = document.getElementById('children_add');
const childDel = document.getElementById('children_del');
const infantAdd = document.getElementById('infant_add');
const infantDel = document.getElementById('infant_del');
const adultCount = document.getElementById('adultCount');
const childrenCount = document.getElementById('childrenCount');
const infantCount = document.getElementById('infantCount');
const travellerOption = document.getElementById('travellerOption');
const traveller_click = document.getElementById('travellers');

// ===== CLASS ELEMENTS =====
const classOption = document.getElementById('classOption');
const class_click = document.getElementById('travellerClass');
const flight_class = document.getElementsByName('classes');
const classDone = document.getElementById('classSubmit');

// ===== TRIP TYPE ELEMENTS =====
const oneBtn = document.getElementById('one');
const roundBtn = document.getElementById('round');
const multiBtn = document.getElementById('multi');

// ===== AIRPORT DATABASE =====
let Airports = [
    { name: "Indira Gandhi International Airport", city: "Delhi (DEL)", country: "India" },
    { name: "Bengaluru International Airport", city: "Bangalore (BLR)", country: "India" },
    { name: "Chhatrapati Shivaji International Airport", city: "Mumbai (BOM)", country: "India" },
    { name: "Netaji Subhash Chandra Bose International Airport", city: "Kolkata (CCU)", country: "India" },
    { name: "Dabolim Goa International Airport", city: "Goa (GOI)", country: "India" },
    { name: "Rajiv Gandhi International Airport", city: "Hyderabad (HYD)", country: "India" },
    { name: "Madras, Chennai International Airport", city: "Chennai (MAA)", country: "India" },
    { name: "Changi Airport", city: "Singapore (SIN)", country: "Singapore" },
    { name: "Dubai International Airport", city: "Dubai (DXB)", country: "UAE" },
    { name: "Suvarnabhumi Airport", city: "Bangkok (BKK)", country: "Thailand" },
    { name: "Tribhuvan International Airport", city: "Kathmandu (KTM)", country: "Nepal" }
];

// ===== FUNCTIONS =====
function updateTravellers() {
    totalCount = adult + children + infant;
    travellerCount.innerText = `${totalCount} Traveller(s)`;
}

// ===== TRAVELLER BUTTON EVENTS =====
adultAdd.addEventListener('click', () => { adult++; adultCount.innerText = adult; updateTravellers(); });
adultDel.addEventListener('click', () => { if(adult>1) adult--; adultCount.innerText = adult; updateTravellers(); });
childAdd.addEventListener('click', () => { children++; childrenCount.innerText = children; updateTravellers(); });
childDel.addEventListener('click', () => { if(children>0) children--; childrenCount.innerText = children; updateTravellers(); });
infantAdd.addEventListener('click', () => { infant++; infantCount.innerText = infant; updateTravellers(); });
infantDel.addEventListener('click', () => { if(infant>0) infant--; infantCount.innerText = infant; updateTravellers(); });

// ===== TRAVELLER & CLASS DROPDOWN =====
traveller_click.addEventListener('click', () => {
    travellerOption.style.display = travellerOption.style.display==='block'?'none':'block';
    classOption.style.display = 'none';
});
class_click.addEventListener('click', () => {
    classOption.style.display = classOption.style.display==='block'?'none':'block';
    travellerOption.style.display = 'none';
});
classDone.addEventListener('click', () => {
    flight_class.forEach(el => { if(el.checked) travelClass.innerText = el.value; });
    classOption.style.display = 'none';
});

// ===== TRIP TYPE LOGIC =====
oneBtn.addEventListener('click', () => {
    trip = "one"; arrive.disabled = true; arrive.style.color="gray";
    oneBtn.style.backgroundColor="white"; oneBtn.style.color="#1853A2";
    roundBtn.style.backgroundColor=multiBtn.style.backgroundColor="transparent";
    roundBtn.style.color=multiBtn.style.color="#CAD5F5";
});
roundBtn.addEventListener('click', () => {
    trip="round"; arrive.disabled=false; arrive.style.color="black";
    roundBtn.style.backgroundColor="white"; roundBtn.style.color="#1853A2";
    oneBtn.style.backgroundColor=multiBtn.style.backgroundColor="transparent";
    oneBtn.style.color=multiBtn.style.color="#CAD5F5";
});
multiBtn.addEventListener('click', () => {
    trip="multi"; arrive.disabled=false; arrive.style.color="black";
    multiBtn.style.backgroundColor="white"; multiBtn.style.color="#1853A2";
    oneBtn.style.backgroundColor=roundBtn.style.backgroundColor="transparent";
    oneBtn.style.color=roundBtn.style.color="#CAD5F5";
});

// ===== AUTOCOMPLETE =====
function searchAutoComplete(destination, results, feed){
    results.innerHTML="";
    results.style.display="block";
    let filtered = Airports.filter(a => a.city.toLowerCase().includes(feed.toLowerCase()) || a.name.toLowerCase().includes(feed.toLowerCase()) );
    if(filtered.length===0) filtered=Airports;
    filtered.forEach(el=>{
        let div=document.createElement('div');
        div.className="autoFeed";
        div.innerHTML=`<div class="autoPlane"><img src="icons/plane.png" class="autoImg" alt=""></div>
        <div class="autoDetails"><h3 class="autoCity">${el.city}</h3>
        <div class="autoAirport"><p class="autoAirportName">${el.name}</p><p class="autoCountry">${el.country}</p></div></div>`;
        div.addEventListener('click', ()=>{ destination.value=el.city; results.style.display="none"; });
        results.appendChild(div);
    });
}

// ===== AUTOCOMPLETE EVENT LISTENERS =====
from.addEventListener('input', ()=>searchAutoComplete(from, fromBox, from.value));
to.addEventListener('input', ()=>searchAutoComplete(to, toBox, to.value));
from.addEventListener('focus', ()=>searchAutoComplete(from, fromBox, from.value));
to.addEventListener('focus', ()=>searchAutoComplete(to, toBox, to.value));

// ===== SWAP ORIGIN/DESTINATION =====
swap.addEventListener('click', ()=>{ let temp=from.value; from.value=to.value; to.value=temp; });

// ===== FINAL SEARCH =====
finalSearch.addEventListener('click', ()=>{
    if(!from.value) return alert('Please enter valid origin city');
    if(!to.value) return alert('Please enter valid destination city');
    if(!depart.value) return alert('Please enter valid departure date');

    const searchData = {
        from: from.value,
        to: to.value,
        depart: depart.value,
        arrive: arrive.value,
        travellers: totalCount,
        adults: adult,
        children: children,
        infants: infant,
        flightClass: travelClass.innerText,
        trip: trip
    };

    localStorage.setItem("searchQuery", JSON.stringify(searchData));
    window.location.href = "flightSearch.html";
});
