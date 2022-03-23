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

router.get("/", (req, res) => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //User is signed in
        res.redirect('/dashboard');
      } else {
        // No user is signed in.
        res.render("dashboardRegister", {title: "Register", userProfile: { displayName: "" }});
      }
    });
});


router.post('/', jsonParser, function(req, res, next) {
    var fullName = req.body.fullName;
    var companyName = req.body.companyName;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    check('username', 'Username field is required').not().isEmpty();
    check('email', 'Email is not valid').isEmail();
    check('password', 'Password is required').not().isEmpty();
    check('password2', 'Passwords do not match').equals(req.body.password);

    firebase.auth().createUserWithEmailAndPassword(email, password).then(userData => {
        // success - do stuff with userData 
        console.log("Successfully created user with email" + email);

     }).catch(error => { 
        // do stuff with error 
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('error_msg', 'Registration Failed. Make sure all fields are properly filled.' + error.message);
        res.redirect('/register');
        console.log("Error creating user: ", error);
     });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Updates the user attributes:
            user.updateProfile({
                displayName: username
            }).then(function() {
                console.log('success_msg', 'You are now registered and can login');
                res.redirect('/login');
            }, function(error) {
                // An error happened.
                // do stuff with error 
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('error_msg', 'Registration Failed. Make sure all fields are properly filled.' + error.message);
                res.redirect('/register');
                console.log("Error creating user: ", error);
            });

            //Post Data
            var postData = {};
            if (companyName != null || companyName != "") {
                postData = { 
                    fullName: fullName,
                    username: username,
                    email: email,
                    companyName: companyName
                }
            } else {
                postData = { 
                    fullName: fullName,
                    username: username,
                    email: email,
                    companyName: companyName
                }
            }

            var updates = {};
            updates['/users/' + user.uid + '/'] = postData;

            firebase.database().ref().update(updates);
        } else {
            // No user is signed in.
        }
    });


});



module.exports = router;