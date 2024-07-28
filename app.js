require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module to handle file paths
const userRoutes = require('./routes/userRoutes'); // Ensure this is the correct relative path to your user routes

const app = express();
const port = process.env.PORT || 3000; // Use the port from environment variables or default to 3000

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory if you have other static files like CSS, JS, images, etc.
app.use(express.static(path.join(__dirname, 'public')));

// Use user-defined routes from the userRoutes module
app.use('/api', userRoutes);

// Root route to serve the index.html from the views directory
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'index.html');
    res.sendFile(filePath, function (err) {
        if (err) {
            console.log(err); // Log error to console
            res.status(404).send('Sorry, we cannot find that file!'); // Send a user-friendly message
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
