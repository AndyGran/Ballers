const http = require('http');
const path = require("path");
const express = require('express');
const portNumber = 6969;
const fs = require("fs");
const app = express();
const axios = require('axios');
const Chart = require('chart.js/auto');
require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') })
const { MongoClient, ServerApiVersion } = require('mongodb');

app.listen(portNumber);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

const API_KEY = "e8f985a6-1a6d-4e12-88d2-e751f9a7a246"

const uri = process.env.MONGO_CONNECTION_STRING;

const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};

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

// let data = {
//   datasets : {
//   labels: [1,2,3,4,5],
//   datasets: [{
//       backgroundColor:"rgba(0,0,255,1.0)",
//       borderColor: "rgba(0,0,255,0.1)",
//       data: <%- playerStats %>
//   }]
//   },
// }

// let ctx = document.getElementById("graph").getContext("2d");
// let chart = new Chart(ctx).Line(data)


app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.get("/", (request, response) => {
    response.render("index");
 });

app.get("/compare", async (request, response) => {
  p1 = request.query.player1
  p2 = request.query.player2
  const [total_games1, playerStats1] = await getPlayers(...p1.split(" "))
  const [total_games2, playerStats2] = await getPlayers(...p2.split(" "))
  const total_games = total_games1.length > total_games2.length ? total_games1 : total_games2
  response.render("compare", {"P1": p1,"P2": p2, "total_games": total_games, "playerStats1": playerStats1, "playerStats2": playerStats2})
})


 async function getPlayers(first_name, last_name){
  lookUpOneEntry(first_name,last_name)
        .then(result => {
            id = result.id;
        })
        .catch(error => {
          id = playerID(first_name,last_name);
          insert(first_name,last_name,id)
        });
  let player_stats = await playerStats(id)
  const total_games = Array.from({ length: player_stats.length }, (_, index) => index + 1);
  return [total_games, player_stats]
 };

 async function insert(first_name, last_name, id) {
  const client = new MongoClient(uri, {serverApi: ServerApiVersion.v1 });
  try {
      await client.connect();
      let player = {first_name: first_name, last_name: last_name, id: id};
      await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(player);
  }
  catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

async function lookUpOneEntry(first_name,last_name) {
  const promise = new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
      try {
          await client.connect();
          let filter = {first_name: first_name, last_name: last_name};
          const result = await client.db(databaseAndCollection.db)
                          .collection(databaseAndCollection.collection)
                          .findOne(filter);
          if (result) {
              resolve(result);
          } else {
              reject(new Error("No matching records found"));
          }
      } catch (error) {
          reject(error);
      } finally {
          client.close();
      }
  }, 0);
  return promise;
}

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