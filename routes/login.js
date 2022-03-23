var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

//Firebase Stuff

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");



//Get Request
router.get("/", (req, res) => {
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	//User is signed in
	    res.redirect('/dashboard');
	  } else {
	    // No user is signed in.
	    res.render("dashboardLogin", {title: "Login", userProfile: { displayName: "" }});
	  }
	});
});

router.post('/', jsonParser, function(req, res, next) {
	var email = req.body.email;
    var password = req.body.password;

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  console.log(error.code);
	  console.log(error.message);

	  // ...
	});
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    res.redirect('/dashboard');
	  } else {
	    // No user is signed in.
	  }
	});
});

module.exports = router;