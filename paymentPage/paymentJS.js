var show = function showAlert() {
	let name = document.getElementById('cardHolderName').value;
	let number = document.getElementById('cardNumber').value;
	let month = document.getElementById('month').value;
	let year = document.getElementById('year').value;
	let cvv = document.getElementById('cvv').value;
	
	if (name == '' || number == '' || month == '0' || month == '' || year == '' || cvv == '') {
		alert('Please fill all required card details');
		return;
	}
	
	// Validate card number (should be 16 digits)
	if (number.length !== 16) {
		alert('Card number must be 16 digits');
		return;
	}
	
	// Validate CVV (should be 3 digits)
	if (cvv.length !== 3) {
		alert('CVV must be 3 digits');
		return;
	}
	
	// Show loading state
	const payButton = document.getElementById('mk-pym');
	payButton.innerText = 'Processing...';
	payButton.style.backgroundColor = '#999';
	payButton.style.pointerEvents = 'none';
	
	// Simulate payment processing
	setTimeout(() => {
		// Store payment details in localStorage for bill generation
		const paymentInfo = {
			cardHolderName: name,
			cardNumber: '**** **** **** ' + number.slice(-4),
			transactionId: 'TXN' + Date.now(),
			paymentDate: new Date().toISOString(),
			status: 'Success'
		};
		
		localStorage.setItem('lastPayment', JSON.stringify(paymentInfo));
		
		// Redirect to bill page without alert
		window.location.href = '../bill.html';
	}, 2000);
};

let signUpAppend = JSON.parse(localStorage.getItem('signUp'));

if (signUpAppend && signUpAppend[0]?.isCorrect === true) {
	document.getElementById('useWallet').innerText = 'Use your wallet amount';
	document.getElementById('useAmount').innerText = 'Use';
}

let bookedTicket = JSON.parse(localStorage.getItem('bookingDetailOfUSer'));
let userDetail = JSON.parse(localStorage.getItem('searchQuery'));

function timeDiff() {
	let tOff = bookedTicket.flight.takeoff_time;
	let landIng = bookedTicket.flight.landing_time;

	let toffInMin = parseInt(tOff.slice(0, 2)) * 60 + parseInt(tOff.slice(3, 6));
	let landIngInMin = parseInt(landIng.slice(0, 2)) * 60 + parseInt(landIng.slice(3, 6));

	if (landIngInMin < toffInMin) {
		landIngInMin += 24 * 60;
	}

	let hrs = Math.floor((landIngInMin - toffInMin) / 60);
	let min = (landIngInMin - toffInMin) % 60;
	return `${hrs}h ${min}m`;
}

document.getElementById('flightRoute').innerHTML = `${bookedTicket.flight.source}-${bookedTicket.flight.destination}`;
document.getElementById('departDate').innerHTML = bookedTicket.flight.journey_date;
document.getElementById('Carrier').innerHTML = bookedTicket.flight.airline_name;
document.getElementById('departTime').innerText = bookedTicket.flight.takeoff_time;
document.getElementById('duration').innerHTML = `${timeDiff()}`;
document.getElementById('landingDate').innerText = bookedTicket.flight.landing_time;
document.getElementById('aircraftName').innerHTML = `${bookedTicket.flight.aircraft_code} - ${bookedTicket.flight.aircraft_number}`;
document.getElementById('source').innerText = bookedTicket.flight.source;
document.getElementById('destination').innerText = bookedTicket.flight.destination;
document.getElementById('takeoffDate').innerText = userDetail.depart;
document.getElementById('arrivalDate').innerText = userDetail.arrive;
document.getElementById('adult').innerText = userDetail.adultCount;
document.getElementById('child').innerText = userDetail.childrenCount;
document.getElementById('infant').innerText = userDetail.infantCount;
document.getElementById('price').innerHTML = `&#8377;  ${bookedTicket.flight.price}`;

var payAmount = bookedTicket.flight.price + 779;
localStorage.setItem('grandTotalAmount', payAmount);
document.getElementById('payableamount').innerHTML = `&#8377;  ${payAmount}`;

// Store booking details for bill generation
const bookingForBill = {
	bookingId: 'EMT' + Date.now(),
	userEmail: signUpAppend && signUpAppend[0] ? signUpAppend[0].email : 'guest@example.com',
	flightDetails: bookedTicket.flight,
	passengers: {
		adults: userDetail.adultCount,
		children: userDetail.childrenCount,
		infants: userDetail.infantCount
	},
	basePrice: bookedTicket.flight.price,
	taxes: 779,
	totalAmount: payAmount,
	bookingDate: new Date().toISOString()
};

localStorage.setItem('lastBooking', JSON.stringify(bookingForBill));