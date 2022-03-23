// index.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");

var routes = require("./routes/index");
var registerRoute = require("./routes/register");
var loginRoute = require("./routes/login");
var postRoute = require("./routes/post");
var findPostsRoute = require("./routes/findPosts");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes Definitions
 */

app.use('/', routes);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/post', postRoute);
app.use('/findPosts', findPostsRoute);

/**
 * Server Activation
 */

app.listen(port, () => {
	console.log(`Listening to requests on http://localhost:${port}`);
});

/**
 * Firebase Testing
 */

