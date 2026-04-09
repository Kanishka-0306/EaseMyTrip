const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const PORT = 5005;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// ====== CONNECT TO MONGODB ======
mongoose
  .connect("mongodb://127.0.0.1:27017/easeMyTrip", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Failed:", err));

// ====== SCHEMAS ======
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  createdAt: { type: Date, default: Date.now }
});

const flightSchema = new mongoose.Schema({
  airline_name: { type: String, required: true },
  airline_logo: String,
  source: { type: String, required: true },
  destination: { type: String, required: true },
  journey_date: { type: String, required: true },
  takeoff_time: { type: String, required: true },
  landing_time: { type: String, required: true },
  aircraft_code: String,
  aircraft_number: String,
  price: { type: Number, required: true },
  available_seats: { type: Number, default: 180 },
  flight_class: { type: String, default: 'Economy' },
  status: { type: String, default: 'On-time', enum: ['On-time', 'Delayed', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
  flightDetails: {
    airline_name: String,
    source: String,
    destination: String,
    journey_date: String,
    takeoff_time: String,
    landing_time: String,
    aircraft_code: String,
    aircraft_number: String
  },
  passengers: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 }
  },
  basePrice: { type: Number, required: true },
  taxes: { type: Number, default: 779 },
  totalAmount: { type: Number, required: true },
  bookingId: { type: String, unique: true },
  status: { type: String, default: 'Confirmed', enum: ['Confirmed', 'Cancelled', 'Pending'] },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Failed'] },
  createdAt: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Card' },
  cardDetails: {
    cardNumber: String,
    cardHolderName: String
  },
  transactionId: { type: String, unique: true },
  status: { type: String, default: 'Success', enum: ['Success', 'Failed', 'Pending'] },
  billGenerated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// ====== MODELS ======
const User = mongoose.model("User", userSchema);
const Flight = mongoose.model("Flight", flightSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Payment = mongoose.model("Payment", paymentSchema);

// ====== HELPER FUNCTIONS ======
function generateBookingId() {
  return 'EMT' + Date.now() + Math.floor(Math.random() * 1000);
}

function generateTransactionId() {
  return 'TXN' + Date.now() + Math.floor(Math.random() * 10000);
}

// ======================================================
// ✅ USER SIGNUP
// ======================================================
app.post("/users/signup", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and Password required!" });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role: role || 'user' });
    await newUser.save();

    res.status(201).json({ message: "Signup successful!", userId: newUser._id, role: newUser.role });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup!" });
  }
});

// ======================================================
// ✅ USER LOGIN
// ======================================================
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and Password required!" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password!" });

    res.status(200).json({ message: "Login successful!", userId: user._id, email: user.email, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login!" });
  }
});

// ======================================================
// ✅ ADMIN LOGIN
// ======================================================
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and Password required!" });

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) return res.status(404).json({ message: "Admin not found!" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password!" });

    res.status(200).json({ message: "Admin login successful!", userId: admin._id, email: admin.email, role: admin.role });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error during admin login!" });
  }
});

// ======================================================
// ✅ GET ALL FLIGHTS
// ======================================================
app.get("/flights", async (req, res) => {
  try {
    console.log('📡 GET /flights request');
    const flights = await Flight.find().sort({ journey_date: 1, takeoff_time: 1 });
    console.log(`✅ Returning ${flights.length} flights`);
    res.status(200).json(flights);
  } catch (err) {
    console.error("Get flights error:", err);
    res.status(500).json({ message: "Failed to fetch flights!" });
  }
});

// ======================================================
// ✅ ADD FLIGHT (Admin)
// ======================================================
app.post("/admin/flights", async (req, res) => {
  try {
    console.log('➕ Adding flight:', req.body);
    const requiredFields = ['airline_name', 'source', 'destination', 'journey_date', 'takeoff_time', 'landing_time', 'price'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }
    
    const newFlight = new Flight(req.body);
    await newFlight.save();
    console.log('✅ Flight added:', newFlight._id);
    
    res.status(201).json({ message: "Flight added successfully!", flight: newFlight });
  } catch (err) {
    console.error("Add flight error:", err);
    res.status(500).json({ message: "Failed to add flight!", error: err.message });
  }
});

// ======================================================
// ✅ UPDATE FLIGHT
// ======================================================
app.put("/admin/flights/:id", async (req, res) => {
  try {
    const updatedFlight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFlight) return res.status(404).json({ message: "Flight not found!" });
    res.status(200).json({ message: "Flight updated successfully!", flight: updatedFlight });
  } catch (err) {
    console.error("Update flight error:", err);
    res.status(500).json({ message: "Failed to update flight!" });
  }
});

// ======================================================
// ✅ DELETE FLIGHT
// ======================================================
app.delete("/admin/flights/:id", async (req, res) => {
  try {
    const deletedFlight = await Flight.findByIdAndDelete(req.params.id);
    if (!deletedFlight) return res.status(404).json({ message: "Flight not found!" });
    res.status(200).json({ message: "Flight deleted successfully!" });
  } catch (err) {
    console.error("Delete flight error:", err);
    res.status(500).json({ message: "Failed to delete flight!" });
  }
});

// ======================================================
// ✅ CREATE BOOKING
// ======================================================
app.post("/bookings", async (req, res) => {
  try {
    console.log('📝 Creating booking:', req.body);
    const { userId, userEmail, flightDetails, passengers, basePrice, taxes, totalAmount } = req.body;

    const bookingId = generateBookingId();

    const newBooking = new Booking({
      userId,
      userEmail,
      flightDetails,
      passengers,
      basePrice,
      taxes: taxes || 779,
      totalAmount,
      bookingId,
      status: 'Confirmed',
      paymentStatus: 'Pending'
    });

    await newBooking.save();
    console.log('✅ Booking created:', bookingId);

    res.status(201).json({ message: "Booking created successfully!", booking: newBooking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Failed to create booking!", error: err.message });
  }
});

// ======================================================
// ✅ PROCESS PAYMENT
// ======================================================
app.post("/payments", async (req, res) => {
  try {
    console.log('💳 Processing payment:', req.body);
    const { bookingId, userId, userEmail, amount, cardDetails } = req.body;

    const transactionId = generateTransactionId();

    const newPayment = new Payment({
      bookingId,
      userId,
      userEmail,
      amount,
      cardDetails,
      transactionId,
      status: 'Success'
    });

    await newPayment.save();

    // Update booking payment status
    await Booking.findOneAndUpdate(
      { bookingId },
      { paymentStatus: 'Completed' }
    );

    console.log('✅ Payment processed:', transactionId);

    res.status(201).json({ 
      message: "Payment processed successfully!",
      payment: newPayment,
      transactionId
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Payment failed!", error: err.message });
  }
});

// ======================================================
// ✅ GENERATE BILL
// ======================================================
app.get("/payments/bill/:bookingId", async (req, res) => {
  try {
    console.log('🧾 Generating bill for:', req.params.bookingId);
    
    const booking = await Booking.findOne({ bookingId: req.params.bookingId });
    const payment = await Payment.findOne({ bookingId: req.params.bookingId });

    if (!booking || !payment) {
      return res.status(404).json({ message: "Booking or payment not found!" });
    }

    const billData = {
      bookingId: booking.bookingId,
      transactionId: payment.transactionId,
      userEmail: booking.userEmail,
      flightDetails: booking.flightDetails,
      passengers: booking.passengers,
      basePrice: booking.basePrice,
      taxes: booking.taxes,
      totalAmount: booking.totalAmount,
      paymentDate: payment.createdAt,
      bookingDate: booking.createdAt
    };

    console.log('✅ Bill generated successfully');
    res.status(200).json({ bill: billData });
  } catch (err) {
    console.error("Bill generation error:", err);
    res.status(500).json({ message: "Failed to generate bill!" });
  }
});

// ======================================================
// ✅ GET USER BOOKINGS
// ======================================================
app.get("/bookings/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings!" });
  }
});

// ======================================================
// ✅ ADMIN DASHBOARD STATS
// ======================================================
app.get("/admin/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalFlights = await Flight.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      totalUsers,
      totalFlights,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats!" });
  }
});

// ======================================================
// ✅ GET ALL BOOKINGS (Admin)
// ======================================================
app.get("/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    console.log(`📊 Returning ${bookings.length} bookings to admin`);
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Get all bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings!" });
  }
});

// ======================================================
// ✅ GET ALL USERS (Admin)
// ======================================================
app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users!" });
  }
});

// ======================================================
// ✅ CANCEL BOOKING
// ======================================================
app.put("/bookings/cancel/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.bookingId },
      { status: 'Cancelled' },
      { new: true }
    );
    res.status(200).json({ message: "Booking cancelled successfully!", booking });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ message: "Failed to cancel booking!" });
  }
});

// ======================================================
// ✅ DEFAULT ROUTE
// ======================================================
app.get("/", (req, res) => {
  res.send("EaseMyTrip Backend Server Running ✈️");
});

// ======================================================
// ✅ START SERVER
// ======================================================
app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  
  // Create default admin
  const adminExists = await User.findOne({ email: 'admin@easemytrip.com' });
  if (!adminExists) {
    const hashedPass = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@easemytrip.com',
      password: hashedPass,
      role: 'admin'
    });
    console.log('✅ Default admin created: admin@easemytrip.com / admin123');
  }
});