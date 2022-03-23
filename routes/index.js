var express = require('express');
var router = express.Router();

//Firebase Stuff

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
firebase.initializeApp(firebaseConfig);
// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

router.get("/", (req, res) => {
	//Uses the pug renderer to pull up the index file and passes in the title string
	res.render("index", { title: "Home" });
});



/* GET users listing. */
router.get("/signout", (req, res) => {
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	  res.redirect("/");
	}).catch(function(error) {
	  // An error happened.
	});
});

router.get("/user", (req, res) => {

	var user = firebase.auth().currentUser;
	var name, email, photoUrl, uid, emailVerified;
	var userPostsArray = [];
	var actualPostsArray = [];
	var readyToRender = false;

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    name = user.displayName;
		email = user.email;
		photoUrl = user.photoURL;
		emailVerified = user.emailVerified;
		uid = user.uid;
		var actualPost;

	  	//Grab Users Posts
		var getUserPosts = firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
			var userPosts = snapshot.child("posts").val();
			var fullName = snapshot.child("fullName").val();
			for (var post in userPosts) {
				var getActualPosts = firebase.database().ref('/posts/' + post).once('value').then(function(snapshot) {
					actualPostsArray.push(snapshot.val());
					console.log(JSON.stringify(actualPostsArray));
				});
			}

			Promise.all([getUserPosts, getActualPosts]).then(function(results){
				res.render("dashboardUser", {title: "Dashboard", userProfile: { fullName: fullName, displayName: name, email: email}, posts: actualPostsArray });
	        	//res.render("user", { title: "Profile", userProfile: { nickname: name, fullName: fullName }, userStatusLink: "signout", userStatusText: "Log Out", posts: actualPostsArray });
	    	});
			
		});


	  } else {
	    // No user is signed in.
	    res.redirect("/login");
	  }
	});
});

router.get("/dashboard", (req, res) => {

	var user = firebase.auth().currentUser;
	var name, email, photoUrl, uid, emailVerified;
	var userPostsArray = [];
	var actualPostsArray = [];
	var readyToRender = false;

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    name = user.displayName;
		email = user.email;
		photoUrl = user.photoURL;
		emailVerified = user.emailVerified;
		uid = user.uid;
		var actualPost;

	  	//Grab Users Posts
		var getUserPosts = firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
			var userPosts = snapshot.child("posts").val();
			var fullName = snapshot.child("fullName").val();
			for (var post in userPosts) {
				var getActualPosts = firebase.database().ref('/posts/' + post).once('value').then(function(snapshot) {
					actualPostsArray.push(snapshot.val());
					console.log(JSON.stringify(actualPostsArray));
				});
			}

			Promise.all([getUserPosts, getActualPosts]).then(function(results){
				res.render("dashboardIndex", {title: "Dashboard", userProfile: { fullName: fullName, displayName: name, email: email}, posts: actualPostsArray });
	        	//res.render("user", { title: "Profile", userProfile: { nickname: name, fullName: fullName }, userStatusLink: "signout", userStatusText: "Log Out", posts: actualPostsArray });
	    	});
			
		});


	  } else {
	    // No user is signed in.
	    res.redirect("/login");
	  }
	});
});


router.get("/viewPost", (req, res) => {

	var user = firebase.auth().currentUser;
	var post;

	firebase.auth().onAuthStateChanged(function(user) {
	if (user) {

		// query user class to get reference keys to posts
		var postList = firebase.database().ref('/posts/' + req.query.postID);

		///// NEW - create promise
		var postListPromise = new Promise(function(resolve, reject) {
		    postList.once('value').then(function(snapshot) {
		    	// save data to variable post 
		    	post = snapshot.val();
		        resolve(post);
		        if (post.id != null) {
		        	res.render("dashboardViewPost", {title: "Posts",  userProfile: { displayName: user.displayName}, post: post });
		        }

		    }).catch(function(error){
		    	res.redirect("/dashboard");
		    });

		  });

		// Promise.all([getRecentPosts]).then(function(results){
		// 		res.render("dashboardFindPosts", {title: "Posts", userProfile: { displayName: name, email: email}, posts: actualPostsArray });
	 //        	//res.render("user", { title: "Profile", userProfile: { nickname: name, fullName: fullName }, userStatusLink: "signout", userStatusText: "Log Out", posts: actualPostsArray });
	 //    	});

	  } else {
	    // No user is signed in.
	    res.redirect("/login");
	  }
	});
});



module.exports = router;