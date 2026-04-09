// ===== DISPLAY USER ON NAVBAR =====
setTimeout(() => {
    let signUpAppend = JSON.parse(localStorage.getItem('signUp'));
    if (signUpAppend && signUpAppend[0]?.isCorrect) {
        let div = document.querySelector('#signupLogin');
        if (div) {
            div.innerHTML = `hi, ${signUpAppend[0].email}`;
            div.style.padding = '5px';
            div.style.fontSize = '15px';
        }
    }
}, 500);

// ===== IMPORT HEADER/NAVBAR =====
import navbar from '../component/header.js';
const headerPlace = document.getElementById('placeHeader');
if (headerPlace) headerPlace.innerHTML = navbar();

// ===== GET BOOKING & USER DETAILS =====
let bookedTicket = JSON.parse(localStorage.getItem('bookingDetailOfUser'));
let userDetail = JSON.parse(localStorage.getItem('searchQuery'));

// ===== HELPER FUNCTION: TIME DIFFERENCE =====
function timeDiff(tOff, landIng) {
    if (!tOff || !landIng) return 'N/A';
    let toffInMin = parseInt(tOff.slice(0, 2)) * 60 + parseInt(tOff.slice(3,5));
    let landIngInMin = parseInt(landIng.slice(0, 2)) * 60 + parseInt(landIng.slice(3,5));
    if (landIngInMin < toffInMin) landIngInMin += 24*60;
    let hrs = Math.floor((landIngInMin - toffInMin)/60);
    let min = (landIngInMin - toffInMin) % 60;
    return `${hrs}h ${min}m`;
}

// ===== RENDER FLIGHT, USER & PRICE DETAILS =====
if (bookedTicket && bookedTicket.flight && userDetail) {

    const flight = bookedTicket.flight;

    // Flight Details
    document.getElementById('flightRoute').innerHTML = `${flight.source || ''} - ${flight.destination || ''}`;
    document.getElementById('departDate').innerHTML = flight.journey_date || '';
    document.getElementById('Carrier').innerHTML = flight.airline_name || '';
    document.getElementById('departTime').innerText = flight.takeoff_time || '';
    document.getElementById('duration').innerHTML = flight.duration || timeDiff(flight.takeoff_time, flight.landing_time);
    document.getElementById('landingDate').innerText = flight.landing_time || '';
    document.getElementById('aircraftName').innerHTML = `${flight.aircraft_code || 'NA'} - ${flight.aircraft_number || 'NA'}`;
    document.getElementById('source').innerText = flight.source || '';
    document.getElementById('destination').innerText = flight.destination || '';

    // User Details
    document.getElementById('takeoffDate').innerText = userDetail.depart || '';
    document.getElementById('arrivalDate').innerText = userDetail.arrive || '';
    document.getElementById('adult').innerText = userDetail.adults || userDetail.adultCount || 0;
    document.getElementById('child').innerText = userDetail.children || userDetail.childrenCount || 0;
    document.getElementById('infant').innerText = userDetail.infants || userDetail.infantCount || 0;

    // Price Details
    const basePrice = Number(flight.price) || 0;
    const taxes = 779;
    const totalAmount = basePrice + taxes;
    
    document.getElementById('price').innerHTML = `&#8377; ${basePrice}`;
    
    // Store both amounts
    localStorage.setItem('grandTotalAmount', totalAmount);
    localStorage.setItem('finalPayAmount', totalAmount);
    
    document.getElementById('payableamount').innerHTML = `&#8377; ${totalAmount}`;

    // ===== AIRLINE LOGO FIX =====
    const logoImg = document.getElementById('airlinelogo');
    if (logoImg) {
        let logoSrc = flight.airline_logo;
        
        // If no logo provided, use default
        if (!logoSrc || logoSrc.trim() === "") {
            logoSrc = "../icons/airline.png";
        } else {
            // Remove leading '../' if already in subfolder path
            if (logoSrc.startsWith('../')) {
                logoSrc = logoSrc.substring(3);
            }
            // Ensure path starts from root
            if (!logoSrc.startsWith('http') && !logoSrc.startsWith('/')) {
                logoSrc = '../' + logoSrc;
            }
        }
        
        console.log('Setting logo source:', logoSrc);
        logoImg.src = logoSrc;
        logoImg.alt = flight.airline_name || "Airline Logo";
        
        // Fallback if image fails to load
        logoImg.onerror = function() {
            console.log('Logo failed to load, using fallback');
            this.src = "../icons/airline.png";
        };
    }

} else {
    console.log("Booking data not found or incomplete!");
    alert("⚠️ Booking information is missing. Please search for flights again.");
    window.location.href = "../index.html";
}

// ===== MEDICAL REFUND LOGIC =====
window.addMedicalRefund = function(){
    document.getElementById("medicalrefundExtra").style.display = "flex";
    document.getElementById("medicalrefundBorder").style.display = "block";
    let grandTtl = Number(localStorage.getItem("grandTotalAmount"));
    let updateAmount = grandTtl + 99;
    localStorage.setItem('finalPayAmount', updateAmount);
    document.getElementById("payableamount").innerHTML = `&#8377; ${updateAmount}`;
}

window.removeMedicalRefund = function(){
    document.getElementById("medicalrefundExtra").style.display = "none";
    document.getElementById("medicalrefundBorder").style.display = "none";
    let grandTtl = Number(localStorage.getItem("grandTotalAmount"));
    localStorage.setItem('finalPayAmount', grandTtl);
    document.getElementById("payableamount").innerHTML = `&#8377; ${grandTtl}`;
}

// ===== COUPON LOGIC =====
window.applyPromoCode1 = function(){
    document.getElementById("couponCode").value = "EMTNCF";
    console.log("coupon applied");
}

window.applyPromoCode2 = function(){
    document.getElementById("couponCode").value = "EASEGLY";
    console.log("coupon applied");
}

window.applyPromoCode3 = function(){
    document.getElementById("couponCode").value = "EMTLOUNGE";
    console.log("coupon applied");
}

window.appylingCoupon = function(){
    let couponInput = document.getElementById("couponCode").value;
    if(couponInput != ""){
        document.getElementById("applyCoupon").style.backgroundColor = "green";
        document.getElementById("applyCoupon").innerText = "APPLIED";
        setTimeout(() => {
            alert(`${couponInput} is Applied`);
        }, 1000);
    }
}