// ===== IMPORT HEADER/NAVBAR =====
import navbar from "../component/header.js";
const headerPlace = document.getElementById("placeHeader");
if (headerPlace) headerPlace.innerHTML = navbar();

const API_URL = "http://localhost:5005";

// ===== GET BOOKING & USER DETAILS =====
let bookedTicket = JSON.parse(localStorage.getItem("bookingDetailOfUser"));
let userDetail = JSON.parse(localStorage.getItem("searchQuery"));
let signUpAppend = JSON.parse(localStorage.getItem("signUp"));

console.log("📦 Booked Ticket:", bookedTicket);
console.log("👤 User Detail:", userDetail);
console.log("🔐 Sign Up Data:", signUpAppend);

// ===== TIME DIFFERENCE FUNCTION =====
function timeDiff(tOff, landIng) {
  if (!tOff || !landIng) return "N/A";
  let toffInMin = parseInt(tOff.slice(0, 2)) * 60 + parseInt(tOff.slice(3, 5));
  let landIngInMin = parseInt(landIng.slice(0, 2)) * 60 + parseInt(landIng.slice(3, 5));
  if (landIngInMin < toffInMin) landIngInMin += 24 * 60;
  let hrs = Math.floor((landIngInMin - toffInMin) / 60);
  let min = (landIngInMin - toffInMin) % 60;
  return `${hrs}h ${min}m`;
}

// ===== GET AIRLINE LOGO FUNCTION =====
function getAirlineLogo(airlineName) {
  const airline = (airlineName || "").toLowerCase().trim();
  if (airline.includes("indigo")) return "../icons/indigo.jpg";
  if (airline.includes("air india") || airline.includes("airindia")) return "../icons/airindia.jpg";
  if (airline.includes("vistara")) return "../icons/vistara.png";
  if (airline.includes("spice")) return "../icons/spicejet.png";
  if (airline.includes("go first") || airline.includes("gofirst") || airline.includes("go-first"))
    return "../icons/gofirst.png";
  return "../icons/airline.png";
}

// ===== RENDER FLIGHT & USER DETAILS =====
if (bookedTicket && bookedTicket.flight && userDetail) {
  const flight = bookedTicket.flight;

  document.getElementById("flightRoute").innerText = `${flight.source} - ${flight.destination}`;
  document.getElementById("departDate").innerText = flight.journey_date;
  document.getElementById("Carrier").innerText = flight.airline_name;
  document.getElementById("departTime").innerText = flight.takeoff_time;
  document.getElementById("duration").innerText =
    flight.duration || timeDiff(flight.takeoff_time, flight.landing_time);
  document.getElementById("landingDate").innerText = flight.landing_time;
  document.getElementById("aircraftName").innerText = `${flight.aircraft_code} - ${flight.aircraft_number}`;
  document.getElementById("source").innerText = flight.source;
  document.getElementById("destination").innerText = flight.destination;

  // ✅ Airline Logo
  const logoImg = document.getElementById("airlinelogo");
  if (logoImg) {
    const logoSrc = getAirlineLogo(flight.airline_name);
    logoImg.src = logoSrc;
    logoImg.alt = flight.airline_name || "Airline Logo";
    logoImg.onerror = function () {
      this.src = "../icons/airline.png";
    };
  }

  document.getElementById("takeoffDate").innerText = userDetail.depart;
  document.getElementById("arrivalDate").innerText = userDetail.arrive || userDetail.depart;
  document.getElementById("adult").innerText = userDetail.adults || userDetail.adultCount || 0;
  document.getElementById("child").innerText = userDetail.children || userDetail.childrenCount || 0;
  document.getElementById("infant").innerText = userDetail.infants || userDetail.infantCount || 0;

  const basePrice = Number(flight.price) || 0;
  const taxes = 779;
  const totalAmount = basePrice + taxes;

  localStorage.setItem("grandTotalAmount", totalAmount);
  localStorage.setItem("finalPayAmount", totalAmount);

  document.querySelectorAll("#price")[0].innerText = `₹${basePrice}`;
  document.querySelectorAll("#price")[1].innerText = `₹${taxes}`;
  document.querySelectorAll("#payableamount").forEach((el) => (el.innerHTML = `₹${totalAmount}`));
} else {
  console.log("⚠️ Booking data missing!");
  alert("⚠️ Booking information is missing. Please search for flights again.");
  window.location.href = "../index.html";
}

// ===== MAKE PAYMENT FUNCTION =====
window.show = async function makePayment() {
  console.log("💳 Starting payment process...");

  // Get user details from any possible key
  const user =
    JSON.parse(localStorage.getItem("loggedInUser")) ||
    JSON.parse(localStorage.getItem("signUp")) ||
    JSON.parse(localStorage.getItem("userLogin"));

  const bookedTicket = JSON.parse(localStorage.getItem("bookingDetailOfUser"));
  const userDetail = JSON.parse(localStorage.getItem("searchQuery"));
  const totalAmount = Number(
    localStorage.getItem("finalPayAmount") || localStorage.getItem("grandTotalAmount")
  );

  // Get card details
  const cardHolderName = document.getElementById("cardHolderName").value;
  const cardNumber = document.getElementById("cardNumber").value;
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;
  const cvv = document.getElementById("cvv").value;

  // Validate inputs
  if (!cardHolderName || !cardNumber || !month || month === "0" || !year || !cvv) {
    alert("Please fill all required card details");
    return;
  }

  if (cardNumber.length !== 16) {
    alert("Card number must be 16 digits");
    return;
  }

  if (cvv.length !== 3) {
    alert("CVV must be 3 digits");
    return;
  }

  if (!totalAmount || isNaN(totalAmount)) {
    alert("Invalid payment amount");
    return;
  }

  // Show loading state
  const payButton = document.getElementById("mk-pym");
  payButton.innerText = "Processing...";
  payButton.style.backgroundColor = "#999";
  payButton.style.pointerEvents = "none";

  // ✅ Get user details
  let userEmail = "";
  let userId = "";

  if (Array.isArray(user)) {
    userEmail = user[0]?.email || "guest@gmail.com";
    userId = user[0]?._id || user[0]?.userId || "guest";
  } else if (typeof user === "object" && user !== null) {
    userEmail = user.email || user.userEmail || "guest@gmail.com";
    userId = user._id || user.userId || "guest";
  } else {
    userEmail = "guest@gmail.com";
    userId = "guest";
  }

  if (!userEmail) {
    alert("Please login to continue");
    window.location.href = "../login/login.html";
    return;
  }

  const basePrice = Number(bookedTicket.flight.price) || 0;
  const taxes = 779;

  // Prepare booking data with flightId
  const bookingData = {
    userId: userId,
    userEmail: userEmail,
    flightId: bookedTicket.flight._id, // ✅ Include flight ID
    flightDetails: {
      airline_name: bookedTicket.flight.airline_name,
      source: bookedTicket.flight.source,
      destination: bookedTicket.flight.destination,
      journey_date: bookedTicket.flight.journey_date,
      takeoff_time: bookedTicket.flight.takeoff_time,
      landing_time: bookedTicket.flight.landing_time,
      aircraft_code: bookedTicket.flight.aircraft_code,
      aircraft_number: bookedTicket.flight.aircraft_number,
    },
    passengers: {
      adults: userDetail.adults || userDetail.adultCount || 1,
      children: userDetail.children || userDetail.childrenCount || 0,
      infants: userDetail.infants || userDetail.infantCount || 0,
    },
    basePrice,
    taxes,
    totalAmount,
  };

  try {
    // Step 1: Create booking
    console.log("📝 Creating booking...", bookingData);
    const bookingRes = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (!bookingRes.ok) {
      const errorData = await bookingRes.json();
      throw new Error(errorData.message || "Booking failed");
    }

    const bookingResult = await bookingRes.json();
    console.log("✅ Booking created:", bookingResult);

    // Step 2: Process payment
    const paymentData = {
      bookingId: bookingResult.booking.bookingId,
      userId: userId,
      userEmail,
      amount: totalAmount,
      cardDetails: {
        cardNumber: "**** **** **** " + cardNumber.slice(-4),
        cardHolderName: cardHolderName,
      },
    };

    console.log("💳 Processing payment...", paymentData);
    const paymentRes = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    if (!paymentRes.ok) {
      const errorData = await paymentRes.json();
      throw new Error(errorData.message || "Payment failed");
    }

    const paymentResult = await paymentRes.json();
    console.log("✅ Payment processed:", paymentResult);

    // ✅ Store details for bill page (include user email)
    localStorage.setItem("lastBooking", JSON.stringify(bookingResult.booking));
    localStorage.setItem("lastPayment", JSON.stringify(paymentResult.payment));
    localStorage.setItem("loggedUserEmail", userEmail); // ✅ For bill page

    // Show success message
    alert(`✅ Payment Successful!\n\nBilled to: ${userEmail}`);

    // ✅ Redirect to bill page after 1s
    setTimeout(() => {
      window.location.href = "../bill.html";
    }, 1000);
  } catch (err) {
    console.error("❌ Payment Error:", err);
    alert(`Payment failed: ${err.message}`);

    // Reset button
    payButton.innerText = "Make Payment";
    payButton.style.backgroundColor = "";
    payButton.style.pointerEvents = "auto";
  }
};
