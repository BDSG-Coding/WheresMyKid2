var key = window.location.href.split('=').pop();

console.log("I'm in activities and here is my key: " + key);

readFirebase(key);

