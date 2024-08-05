const admin = require('firebase-admin');
const serviceAccount = require('./journie-d4114-firebase-adminsdk-5ctdg-cc3b2f9ed5');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;
