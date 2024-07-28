// Import the Firebase-admin library
const admin = require('firebase-admin');

// Load your service account credentials
const serviceAccount = require('./journie-d4114-firebase-adminsdk-5ctdg-cc3b2f9ed5');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get the Firestore database instance
const db = admin.firestore();

// Export the database instance for use in other parts of your application
module.exports = db;
