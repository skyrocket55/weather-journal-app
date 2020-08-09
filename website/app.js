// Weather API
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?';
const apiKey = '86fc68de2a99ff571d0bf9c7f685232c';
const countryCode = 'US';

// Get Information
const generateButton = document.querySelector('#generate');
const zip = document.querySelector('#zip');
const content = document.querySelector('#feelings');

// Append fetched data
const container = document.querySelector('#entryHolder');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener to add function to existing HTML DOM element
generateButton.addEventListener('click', (e) => {
    const textAreaContent = content.value;
    const zipCode = zip.value;

    container.innerHTML = '';

    // Async GET weather data
    const getWeather = async (baseUrl, zipCode, countryCode, apiKey) => {
        const apiEndpoint = `${baseUrl}zip=${zipCode},${countryCode}&appid=${apiKey}`;
        const weatherData = await fetch(apiEndpoint);

        // Transform into JSON
        const allData = await weatherData.json();
        return allData;
    };

    // Async POST
    const postData = async (url = '', data = {}) => {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header        
        });

        try {
            const newData = await response.json();
            return newData;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    // Chain async getWeather to POST then update UI
    getWeather(baseUrl, zipCode, countryCode, apiKey)
        .then((data) => {
            if (!Object.is(data.main, undefined) && !Object.is(data.main, null)) {
                data.main.currentTime = newDate;
                data.main.content = textAreaContent;
                postData('/weather', data);
            } else {
                alert(`Error ${data.cod}: ${data.message}`);
            }
        })
        .then(() => {
            appendData();
        });
});

//  Update UI function
const appendData = async () => {
    const request = await fetch('/all');
    try {
        const requestedData = await request.json();
        const createElement = (title, elementId) => {
            // Wrapper div
            const divElement = document.createElement('div');
            const spanElement = document.createElement('span');

            // Append elements
            container.appendChild(divElement);
            divElement.innerHTML = title;
            divElement.appendChild(spanElement);

            return spanElement;
        };

        requestedData.data.forEach((dataItem) => {
            // Creating elements and appending content
            if (!Object.is(dataItem.currentDate, undefined) && !Object.is(dataItem.currentDate, null)) {
                createElement('Date: ', 'date').innerHTML = dataItem.currentDate;
            }
            if (!Object.is(dataItem.temperature, undefined) && !Object.is(dataItem.temperature, null)) {
                createElement('Temperature: ', 'temperature').innerHTML = dataItem.temperature;
            }
            if (!Object.is(dataItem.content, undefined) && !Object.is(dataItem.content, null)) {
                createElement('Content: ', 'content').innerHTML = dataItem.content;
            }
        });

        // Reset form
        zip.value = '';
        content.value = '';
    } catch (error) {
        console.log(error);
    }
};

window.onload = () => {
    appendData();
};