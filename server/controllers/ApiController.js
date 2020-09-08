//Api controller;
require("dotenv").config({path: '../variables.env'});
const appKey = process.env.APP_KEY
const { dateChanger } = require("../helpers");
const axios = require("axios");


exports.eventSearch = (req, res) => {
    const {keywords, location, category, date} = req.query;
    let url = `http://api.eventful.com/json/events/search?app_key=${appKey}`;
    if(keywords !== undefined){
        url = url + `&keywords=${keywords}`;
    }
    if(location !== undefined){
        url = url + `&location=${location}`;
    }
    if(category !== undefined){
        url = url + `&category=${category}`;
    }
    if(date !== undefined){
        url = url + `&date=${date}`;
    }
    url = url + `&page_size=50`;
    console.log(url);
    axios.get(
        url,
        {method: 'GET'}
    )
    .then(response => {
        const bigData = response.data.events.event;
        console.log(bigData);
        bigData.forEach(data => {
            data.start_time = dateChanger(data.start_time);
        })
        res.send(bigData);
    })
    .catch(err => {
        console.log(err);
    })
}


exports.getEvent = (req, res) => {
    const id = req.query.id;
    const url = `http://api.eventful.com/json/events/get/?app_key=${appKey}&id=${id}`;
    console.log(url);
    axios.get(url)
    .then(response => {
        if(response.data.error){
            res.send(response.data.error);
        }
        else{
            const data = response.data;
            data.start_time = dateChanger(data.start_time);
            res.send(data);
        }
    })
    .catch((error) => {
        console.log(error);
    })
}


exports.getWeather = (req, res) => {
    const {location, date} = req.query;
    let days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    let url = `https://weather.api.here.com/weather/1.0/report.json?app_id=iColaXgwWiL6IDOBtU7U&app_code=SOEYKrTiJA5dMd9x09UJNw&product=forecast_7days_simple&name=${location}`;
    let eventDate = new Date(date).getTime();
    let eventDateDays = new Date(date).getDay();
    var currentDate = new Date();
    var curentTime = currentDate.getTime();
    var sevenDaysAfter = curentTime + (7 * 24 * 60 * 60 * 1000);

    if(sevenDaysAfter >= eventDate && curentTime < eventDate){
        axios.get(url).then(response => {
            let weathers = response.data.dailyForecasts.forecastLocation.forecast;
            weathers.forEach(weather => {
                if(weather.weekday == days[eventDateDays]){
                    weather.moyenne = Math.round((parseFloat(weather.highTemperature, 10) + parseFloat(weather.lowTemperature, 10) )  / 2);
                    return res.send({weather});
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
    else{
        return res.send({error: "Can't get weather for a date superior to 7days "});
    }

}