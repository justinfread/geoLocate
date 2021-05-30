/*
  Using node.js to create a server, receive post requests from client, 
  save data in a database, and respond to get request from the client
  Uses express for server
  Uses NeDB which is a subset of mongoDB's API https://github.com/louischatriot/nedb#creatingloading-a-database
  Uses Geolocation API https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API#the_geolocation_object
  Fine for examples but a more robust database may be required
  for actual projects. Using NeDB is good practice for mongo.
  Project based off of Dan Shiffman's tutorial serries Working with Data and APIs in JavaScript https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X
*/ 

// Include the dependencies from package.json
const express = require('express');
const Datastore = require('nedb');

// Initialize express server as app, give it a port, host a static webpage,
// convert the post request data to json
const app = express();
// Tell the app where to listen
app.listen(3000, () => console.log('listening at port 3000'));
// Host a static webpage on the server in the public folder 
app.use(express.static('public'));
// Allow the post request to be formatted to json, add the
// parameter of a 1mb limit. Other parameters are available
app.use(express.json({limit: '1mb'})); 

// Create and load the database
const database = new Datastore('database.db');
database.loadDatabase();

// All that is happening here is the data is being sent from the client to the server, 
// put in the database, then send the data back to the client.

// Set up a rout to receive a request 
app.post('/api', (request, response) => {
  // Save the request object body to the database and use it in the response 
  const data = request.body;
  database.insert(data);
  // Respond to client side request
  response.json(data);
});

// set up a route for all.html to receive a request from all.html for the data in the database
// Note that I'm using './all' for the route which is unnecessary because it could named anything
// like './api' because it is a different function in the server but may help with debugging
app.get('/all', (request, response) => {
  // Using the find function with empty object to find everything in the database and a 
  // callback function with the two arguments err, and the data object, then sending the data
  // object as the response back to all.html
  database.find({}, (err, data) => { 
    // Do some error handling if the data isn't found in the database
    if(err) {
      response.end();
      return;
    }
    response.json(data);
  });
});
