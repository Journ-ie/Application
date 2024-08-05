const { db } = require('../config/firebase');
const { collection, getDocs } = require('firebase/firestore');

const getUsers = async (req, res) => {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(doc => doc.data());
        res.status(200).json(users);
        
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

module.exports = { getUsers };
