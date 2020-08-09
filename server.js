// Setup empty JS object to act as endpoint for all routes
let projectData = { data: [] };

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 8000;
const server = app.listen(port, () => { console.log(`App running on localhost:${port}`) });

// Post Route
app.post('/weather', (req, res) => {
    const { temp, currentTime, content } = req.body.main;
    const tempResponse = `${temp}°C`;
    const currentDateResponse = currentTime;
    const contentResponse = content;

    projectData.data.push({
        temperature: tempResponse,
        currentDate: currentDateResponse,
        content: contentResponse,
    });

    res.send(projectData);
});

// Callback function to complete GET '/all'
app.get('/all', (req, res) => {
    res.send(projectData);
});