var express = require('express');
var router = express.Router();

//Firebase Stuff

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");



router.get("/", (req, res) => {

	var user = firebase.auth().currentUser;
	var name, email, photoUrl, uid, emailVerified;
	var recentPostsArray = [];

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    name = user.displayName;
		email = user.email;
		photoUrl = user.photoURL;
		emailVerified = user.emailVerified;
		uid = user.uid;

		// query user class to get reference keys to posts
		var postList = firebase.database().ref('/posts');

		//create posts array to store posts that are queried
		var posts = []

		///// NEW - create promise
		var postListPromise = new Promise(function(resolve, reject) {
		    postList.once('value').then(function(snapshot) {
		    	// save data to variable post 
		        var int = 0;
				var actualPostsArray = [];
				var allPosts = snapshot.val();
				for (post in allPosts) {
					if (int < 5) {
						posts.push(snapshot.child(post).val());
						int++;
					}
				}
		        resolve(posts);
		    	res.render("dashboardFindPosts", {title: "Posts", userProfile: { displayName: name, email: email}, posts: posts });
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