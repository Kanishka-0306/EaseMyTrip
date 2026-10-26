# EaseMyTrip – Flight Booking System ✈️

## 📌 About the Project

EaseMyTrip is a web-based flight booking system developed as an academic project. It demonstrates the basic workflow of a flight booking website, allowing users to search for flights and explore the booking process.

The project also includes an admin panel for managing flight-related information and viewing user details.

## 🚀 Features

- **Flight Search:** Search for flights using source, destination, and travel details.
- **Flight Details:** View available flight information.
- **Passenger and Class Selection:** Select travel class and passenger details.
- **User Interface:** Interactive pages for the flight search and booking workflow.
- **Admin Panel:** Manage flight information and access user-related details.
- **Fare Summary:** Display fare and applicable tax details.
- **Payment Simulation:** Demonstrate the payment workflow and bill generation.

## 🛠️ Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

## ⚙️ How It Works

1. The user enters the source, destination, travel date, and other required details.
2. The application displays matching flight information through the implemented flight-search workflow.
3. The user selects a flight and proceeds through the booking interface.
4. The fare summary and payment simulation demonstrate the next steps in the booking process.
5. The admin interface provides flight-management features.

## 💻 Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB, if required by the backend configuration
- Git

### Steps

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project folder:

   ```bash
   cd YOUR_PROJECT_FOLDER
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Configure the MongoDB connection if required by the project.

5. Start the application using the command configured in your project:

   ```bash
   node server.js
   ```

6. Open the local URL shown in the terminal. If the server uses port 5005, visit:

   `http://localhost:5005`

**Note:** The commands above assume that the repository contains `package.json` and `server.js` in the expected locations. Adjust the folder path, database configuration, and startup command to match your actual project structure.

## 🧪 Testing

The application can be checked by testing the flight-search inputs, flight details display, navigation between pages, fare summary, and payment simulation. Admin features should also be tested where available.

## ⚠️ Limitations

- This is an academic project intended for learning and demonstration.
- The payment process is simulated and is not connected to a real payment gateway.
- It is not a production-ready airline booking platform.
- Real airline integration, secure production authentication, and reliable seat reservation would require additional implementation.

## 🔮 Future Enhancements

- Integrate a secure payment gateway.
- Improve mobile responsiveness.
- Strengthen server-side validation and error handling.
- Implement secure authentication and role-based authorization.
- Add persistent booking history and reliable seat availability management.
- Deploy the application online.

## 👩‍💻 Project Purpose

This project helped me gain practical exposure to frontend development, backend routing, database concepts, and the workflow of a flight booking application.

## 📄 License

This project is intended for educational purposes. Add a suitable license if you want others to reuse or distribute the code.
