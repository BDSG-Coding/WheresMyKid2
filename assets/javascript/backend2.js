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

// Create a variable to reference the database.
var database = firebase.database();

//Variables
var activity = "";
var streetAddress = "";
var city = "";
var state = "";
var dateTime = "";
var notes = "";
var key = "";

//Add an activity when we click the submit button
$("#add-activity").on("click", function (event) {
  event.preventDefault();

  //Read in values from the form
  activity = $("#activityInput").val().trim();
  streetAddress = $("#addressInput").val().trim();
  city = $("#cityInput").val().trim();
  state = $("#stateInput").val().trim();
  dateTime = $("#datetime-input").val().trim();
  notes = $("#notes-input").val().trim();

  // Code for handling the push to firebase database
  database.ref().push({
    activity: activity,
    streetAddress: streetAddress,
    city: city,
    state: state,
    notes: notes,
    dateTime: dateTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  //Clear the form after we get the data
  $("#activityInput").val("");
  $("#addressInput").val("");
  $("#cityInput").val("");
  $("#datetime-input").val("");
  $("#notes-input").val("");

});

//Get data from firebase database ordered by the date and time of the activity
database.ref().orderByChild("dateTime").on("child_added", function (snapshot) {
  //Database information
  key = snapshot.key
  activity = snapshot.val().activity;
  streetAddress = snapshot.val().streetAddress;
  city = snapshot.val().city;
  state = snapshot.val().state;
  dateTime = snapshot.val().dateTime;
  var date = moment(dateTime).format("dddd, MMMM Do YYYY");
  var time = moment(dateTime).format("LT");
  notes = snapshot.val().notes;
  //Populate our table with the database information
  var tableRow = $("<tr>");
        tableRow.append("<td>" + activity + "</td>");
        tableRow.append("<td>" + streetAddress + ", " + city + "</td>");
        tableRow.append("<td>" + date + "</td>");
        tableRow.append("<td>" + time + "</td>");
        tableRow.append("<td><button id='info' class='btn btn-default' key='" + key + "'>More Info</button></td>");
        tableRow.append("<td><button id='remove' class='btn btn-default' key='" + key + "'>Remove</button></td>");

        $(".table").append(tableRow);

});

//Google Maps API function
function googleMapsAPI(streetAddress, city, state) {
  var streetAddress1 = streetAddress.split(' ').join('+');
  var city1 = city.split(' ').join('+');
  var state1 = state.split(' ').join('+');
  //URL for our API call
  var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + streetAddress1 + "," + city1 + "," + state1 + "&key=AIzaSyBIQJm-OUevDdIbHlZzj_TPv09iExwCGQg";
  // Here we run our AJAX call to the Google Maps API
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    var uluru = { lat: response.results["0"].geometry.location.lat, lng: response.results["0"].geometry.location.lng };
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru
    });
    var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });

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
  }).then(function (response1) {

      var weathermap = $("#weather-map");

      weathermap.append("<p>" + "Temperature (F): " + response1.main.temp + "</p>");

weathermap.append("<p>"+"Condition: "+(response1.weather["0"].description));
weathermap.append("<p>"+"Wind Speed (mph): "+response1.wind.speed+"</p>");
var image = $("<img>");
image.attr("style", "margin-left: 0px; margin-top: 20px; height: 180px; width: 180px");
if (response1.weather["0"].main === "Rain") {
  image.attr("src", "assets/images/rain.jpg")
} 
else if (
  response1.weather["0"].main === "Clear") {
  image.attr("src", "assets/images/clear.jpg")
  }
else if (response1.weather["0"].main === "Clouds") {
  image.attr("src", "assets/images/clouds.jpg" )
}

else {
  image.attr("src", "#");
}


weathermap.append(image);

    });

}

//Function to get information from firebase databases and populate the activity information page
function readFirebase (key) {

  database.ref(key).on("value", function(snapshot) {
    notes = snapshot.val().notes;
    activity = snapshot.val().activity;
    streetAddress = snapshot.val().streetAddress;
    city = snapshot.val().city;
    state = snapshot.val().state;
    dateTime = snapshot.val().dateTime;
    var date = moment(dateTime).format("dddd, MMMM Do YYYY");
    var time = moment(dateTime).format("LT");
    $("#activity").append("<p>"+activity+"</p>");
    $("#activity").append("<p>"+date+"</p>");
    $("#activity").append("<p>"+time+"</p>");
    $("#activity").append("<p>"+streetAddress+"</p>");
    $("#activity").append("<p>"+city+", "+state+"</p>");
    $("#activity").append("<p>Notes: "+notes+"</p>");
    googleMapsAPI(streetAddress, city, state);
    weatherAPI(city);

  }, function (error) {
      console.log("Error: " + error.code);
  });
};

function removeActivityFirebase (key){
  database.ref(key).remove();
}

$(document).on("click", "#info", function(event) {
  event.preventDefault();
  key = $(this).attr("key");
  window.open("activity.html?key=" + key + "", "_blank");
});

$(document).on("click", "#remove", function(event) {
  event.preventDefault();
  key = $(this).attr("key");
  removeActivityFirebase(key);
  location.reload();
});


