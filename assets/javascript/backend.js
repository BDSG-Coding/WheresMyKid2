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



$("#add-activity").on("click", function (event) {
  event.preventDefault();

  activity = $("#activityInput").val().trim();
  streetAddress = $("#addressInput").val().trim();
  city = $("#cityInput").val().trim();
  state = $("#stateInput").val().trim();
  dateTime = $("#datetime-input").val().trim();
  console.log(dateTime);
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

  activity = snapshot.val().activity;

  streetAddress = snapshot.val().streetAddress;
  city = snapshot.val().city;
  state = snapshot.val().state;
  dateTime = snapshot.val().dateTime;
  notes = snapshot.val().notes;
  
  console.log(activity);

<<<<<<< HEAD
  $("#activity").text("Activity: " + activity);
  $("#date").text("Date: " + dateTime);
  $("#address").text("Location: " + streetAddress + " " + city + "," + state);
  $("#notes").text("Notes: " + notes);
=======
  var listActivity = $("<li>");

  listActivity.append("<ul>" + activity + "</ul>");
  listActivity.append("<ul>" + city + "</ul>");
  listActivity.append("<ul>" + state + "</ul>");
  listActivity.append("<ul>" + dateTime + "</ul>");
  listActivity.append("<ul>" + notes + "</ul>");

$("ul").append(listActivity);
>>>>>>> f70302fea46f23e88c96280d10eb9baf2f45154d


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

  var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?" +
    "q=" + city1 + ",Burundi&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";


  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL1,
    method: "GET"
  })

    .then(function (response1) {
      //console.log(response1);

      var weathermap = $("#weather-map");

      weathermap.append("<p>" + "Temperature (F): " + response1.main.temp + "</p>");



    });

});
