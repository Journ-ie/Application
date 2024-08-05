require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = process.env.PORT || 3000; 


app.use(bodyParser.json()); // parse JSON bodies
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', userRoutes);

// HTML Pages
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'index.html');
    res.sendFile(filePath, function (err) {
        if (err) {
            console.log(err);
            res.status(404).send('Sorry, we cannot find that page!');
        }
    });
});

app.get('/sign-in.html', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'sign-in.html');
    res.sendFile(filePath, function (err) {
        if (err) {
            console.log(err);
            res.status(404).send('Sorry, we cannot find that page!');
        }
    });
});

app.get('/journal.html', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'journal.html');
    res.sendFile(filePath, function (err) {
        if (err) {
            console.log(err);
            res.status(404).send('Sorry, we cannot find that page!');
        }
    });
});

app.get('/setting.html', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'setting.html');
    res.sendFile(filePath, function (err) {
        if (err) {
            console.log(err);
            res.status(404).send('Sorry, we cannot find that page!');
        }
    });
});

app.get('/help.html', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'help.html');
    res.sendFile(filePath, function (err) {
        if (err) {
            console.log(err);
            res.status(404).send('Sorry, we cannot find that page!');
        }
    });
});

// start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
