var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

const {check, validationResult} = require('express-validator');
var jsonParser = bodyParser.json();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());


//Firebase Stuff
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");

// Get a database reference
var db = firebase.database();
var postsRef = db.ref("posts");

router.post('/', jsonParser, function(req, res, next) {
	//Make sure a valid user is logged
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			//If a user is logged in grab the data and assign it to vars
			var deviceType = req.body.device;
		    var issueType = req.body.issue;
		    var issueDescription = req.body.issueDescription;

		    // Validation of data
		    check('deviceType', 'Device is required').not().isEmpty();
		    check('issueType', 'Issue is required').not().isEmpty();
		    check('issueDescription', 'Issue Description is required').not().isEmpty();

		    // Get a key for a new Post.
			var newPostKey = firebase.database().ref().child('posts').push().key;

			//Configure Post Data
			var postData = { 
				device: deviceType,
				issue: issueType,
				description: issueDescription,
				userPoster: user.displayName,
				id: newPostKey
			}
		

			var postDataForUsers = { 
				postID: newPostKey
			}

			// Write the new post's data simultaneously in the posts list and the user's post list.
			var updates = {};
			updates['/posts/' + newPostKey] = postData;
			updates['/users/' + user.uid + '/posts/' + newPostKey] = postDataForUsers;

			firebase.database().ref().update(updates);

			res.redirect("/dashboard");

	  	} else {
	    	// No user is signed in.
	    	console.log("Cannot post! You are not signed in");
	    	res.redirect("/login");
	  	}
	});
});

router.get("/", (req, res) => {
    firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			name = user.displayName;
			res.render("dashboardPost", { title: "post", userProfile: {displayName: name} });
	  	} else {
	    	// No user is signed in.
	    	console.log("Cannot post! You are not signed in");
	    	res.redirect("/login");
	  	}
	});

});


module.exports = router;