// Initialize Firebase

var config = {
  apiKey: "AIzaSyC12qaBlsoq6eh-G4SovMPOJPpByYWOZRE",
  authDomain: "projectone-7ecd1.firebaseapp.com",
  databaseURL: "https://projectone-7ecd1.firebaseio.com",
  projectId: "projectone-7ecd1",
  storageBucket: "projectone-7ecd1.appspot.com",
  messagingSenderId: "92055818718"
};
firebase.initializeApp(config);


//console.log('starting...')


//
// Create a variable to reference the database.
var database = firebase.database();


var activity = "";
var streetAddress = "";
var city = "";
var state = "";
var dateTime = "";
var notes = "";
var key = "";



$("#add-activity").on("click", function (event) {
  event.preventDefault();

  activity = $("#activityInput").val().trim();
  streetAddress = $("#addressInput").val().trim();
  city = $("#cityInput").val().trim();
  state = $("#stateInput").val().trim();
  dateTime = $("#datetime-input").val().trim();
  //console.log(dateTime);
  notes = $("#notes-input").val().trim();

  // Code for handling the push
  database.ref().push({
    activity: activity,
    streetAddress: streetAddress,
    city: city,
    state: state,
    notes: notes,
    dateTime: dateTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  $("#activityInput").val("");
  $("#addressInput").val("");
  $("#cityInput").val("");
  $("#datetime-input").val("");
  $("#notes-input").val("");

});


database.ref().orderByChild("dateTime").on("child_added", function (snapshot) {

  key = snapshot.key
  //console.log(key);
  //readFirebase(key);
  activity = snapshot.val().activity;
  streetAddress = snapshot.val().streetAddress;
  city = snapshot.val().city;
  state = snapshot.val().state;
  dateTime = snapshot.val().dateTime;
  notes = snapshot.val().notes;

  var tableRow = $("<tr>");
        tableRow.append("<td>" + activity + "</td>");
        tableRow.append("<td>" + streetAddress + "</td>");
        tableRow.append("<td>" + dateTime + "</td>");
        tableRow.append("<td>" + dateTime + "</td>");
        tableRow.append("<td><button id='info' class='btn btn-default' key='" + key + "'>More Info</button></td>");
        tableRow.append("<td><button id='remove' class='btn btn-default' key='" + key + "'>Remove</button></td>");

        $(".table").append(tableRow);

});



function googleMapsAPI(streetAddress, city, state) {
  var streetAddress1 = streetAddress.split(' ').join('+');
  var city1 = city.split(' ').join('+');
  var state1 = state.split(' ').join('+');
//console.log(streetAddress1);
  var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + streetAddress1 + "," + city1 + "," + state1 + "&key=AIzaSyBIQJm-OUevDdIbHlZzj_TPv09iExwCGQg";

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function (response) {
  //console.log(response);


  var uluru = { lat: response.results["0"].geometry.location.lat, lng: response.results["0"].geometry.location.lng };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });


  //console.log("------" + response.results["0"].geometry.location.lat + "------");
});
};


function weatherAPI(city) {
  var city1 = city.split(' ').join('+');
  var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?" +
    "q=" + city1 + ",Burundi&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";


  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL1,
    method: "GET"
  })

    .then(function (response1) {
      console.log(response1);

      var weathermap = $("#weather-map");

      weathermap.append("<p>" + "Temperature (F): " + response1.main.temp + "</p>");

weathermap.append("<p>"+"Condition: "+(response1.weather["0"].description));
weathermap.append("<p>"+"Wind Speed (mph): "+response1.wind.speed+"</p>");
    });

}


function readFirebase (key) {
 // var ref = firebase.database().ref(key);
 
 console.log("inside readFirebase");

database.ref(key).on("value", function(snapshot) {
   console.log(snapshot.val());
   streetAddress = snapshot.val().streetAddress;
   city = snapshot.val().city;
   state = snapshot.val().state;
   googleMapsAPI(streetAddress, city, state);
   weatherAPI(city);

}, function (error) {
   console.log("Error: " + error.code);
});
};

function removeActivityFirebase (key){
  database.ref(key).remove();
}

//readFirebase("-LA68Ay1p7Wzc1d6i8bG");
//removeActivityFirebase ("-LA64H_qZ_YItgj5n5kZ");

$(document).on("click", "#info", function(event) {
  console.log("inside click")
  event.preventDefault();
  key = $(this).attr("key");
  console.log("Key: " + key);
  window.open("activity.html?key=" + key + "");
});

$(document).on("click", "#remove", function(event) {
  console.log("inside remove click")
  event.preventDefault();
  key = $(this).attr("key");
  //console.log("Key: " + key);
  removeActivityFirebase(key);
  location.reload();
});


