const http = require('http');
const path = require("path");
const express = require('express');
const portNumber = 6969;
const fs = require("fs");
const app = express();
const axios = require('axios');

app.listen(portNumber);

const API_KEY = "e8f985a6-1a6d-4e12-88d2-e751f9a7a246"

const url = 'https://api.balldontlie.io/v1/teams';

axios.get(url, {
  headers: {
    Authorization: `${API_KEY}`
  }
})
  .then((response) => console.log(response.data))

// fetch(`https://api.balldontlie.io/v1/teams?key=${API_KEY}`)
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

const xValues = [50,60,70,80,90,100,110,120,130,140,150];
const yValues = [7,8,8,9,9,9,10,11,14,14,15];

// new Chart("myChart", {
//   type: "line",
//   data: {
//     labels: xValues,
//     datasets: [{
//       backgroundColor:"rgba(0,0,255,1.0)",
//       borderColor: "rgba(0,0,255,0.1)",
//       data: yValues
//     }]
//   },
//   options:{}
// });



app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.get("/", (request, response) => {
    response.render("index");
 });


