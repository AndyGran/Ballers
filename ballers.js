const http = require('http');
const path = require("path");
const express = require('express');
const portNumber = 6969;
const fs = require("fs");
const app = express();
const axios = require('axios');
const Chart = require('chart.js/auto');

app.listen(portNumber);
app.use(express.static(__dirname + '/public'));

const API_KEY = "e8f985a6-1a6d-4e12-88d2-e751f9a7a246"

// const url = 'https://api.balldontlie.io/v1/teams';

// axios.get(url, {
//   headers: {
//     Authorization: `${API_KEY}`
//   }
// })
//   .then((response) => console.log(response.data))

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

 getPlayers()
 async function getPlayers(){
  //let p1 = document.querySelector("#player1").value
  let first_name = "Anthony"
  let last_name = "Davis"
  let id = await playerID(first_name,last_name)
  let player_stats = await playerStats(id)
  const total_games = Array.from({ length: player_stats.length }, (_, index) => index + 1);
  

  new Chart("myChart", {
  type: "line",
  data: {
    labels: total_games,
    datasets: [{
      backgroundColor:"rgba(0,0,255,1.0)",
      borderColor: "rgba(0,0,255,0.1)",
      data: playerStats
    }]
  },
  options:{}
});



  //let p2 = document.querySelector("#player2").value

  //let search = `${p1}`
  // let url = `https://api.balldontlie.io/v1/players?first_name=${encodeURIComponent(first_name)}&last_name=${encodeURIComponent(last_name)}`
  // let id

  // axios.get(url, {
  //   headers: {
  //     Authorization: `${API_KEY}`
  //   }
  // })
  //   .then((response) => {
  //   id = response.data.data[0].id
  //   return id
  //   })
  //   .then((id)=> {
  //     let url2 = `https://api.balldontlie.io/v1/stats?seasons[]=2023&per_page=100&player_ids[]=${encodeURIComponent(id)}`
  //     axios.get(url2, {
  //       headers: {
  //         Authorization: `${API_KEY}`
  //       }
  //     })
  //       .then((response) => {
  //       console.log(response.data.data[0].player.first_name)
  //       })
  //   })
 }

 async function playerID(first_name, last_name){
  let url = `https://api.balldontlie.io/v1/players?first_name=${encodeURIComponent(first_name)}&last_name=${encodeURIComponent(last_name)}`
  let player = await axios.get(url, {
                headers: {
                 Authorization: `${API_KEY}`
              }
            })
  return (player.data.data[0].id)
 }

 async function playerStats(id){
  let ppg = []
  let url = `https://api.balldontlie.io/v1/stats?seasons[]=2023&per_page=100&player_ids[]=${encodeURIComponent(id)}`
  let response = await axios.get(url, {
    headers: {
     Authorization: `${API_KEY}`
      }
    })
  data = response.data.data
  data.filter(event => event.min != '00').forEach(element => {
  ppg.push(element.pts)})

  return ppg
 }