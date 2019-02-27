import fetch from 'cross-fetch';

const client = {
    openBrowserTab: url => {
        console.log('url!!!', url);
        return fetch('/proxy/openbrowsertab', {
            credentials: 'same-origin',
            method: 'POST', // or 'PUT'
            body: JSON.stringify({ url }), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(response => {
                return Promise.resolve(response);
            }).catch(e => console.log('error => generateWebsite!!!', e));
    },
    closeBrowser: () => {
        return fetch('/proxy/closebrowser', {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(response => {
                return Promise.resolve(response);
            }).catch(e => console.log('error => generateWebsite!!!', e));
    },
    getCurrentWeatherById: placeId => {
        return fetch('https://api.openweathermap.org/data/2.5/weather?' +
        `id=${placeId}&appid=79c7d98d79e9741603d37b74a82f8f9b`)
            .then(response => response.json())
            .then(response => {
                return Promise.resolve(response);
            }).catch(e => console.log('error => generateWebsite!!!', e));
    },
    getForecastWeatherById: placeId => {
        return fetch('https://api.openweathermap.org/data/2.5/forecast?' +
        `id=${placeId}&appid=79c7d98d79e9741603d37b74a82f8f9b`)
            .then(response => response.json())
            .then(response => {
                return Promise.resolve(response);
            }).catch(e => console.log('error => generateWebsite!!!', e));
    },
};

export default client;
