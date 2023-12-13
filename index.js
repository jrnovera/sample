// Entry point

// This will file serve as an entry point for the application

// Dependency
// Include the module / packages to be used in the application

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");

// To access and load environment variables from .env file into process.env
require('dotenv').config();
// Passport helps manage user authentication using different methods like email/password or OAuth;
const passport = require("passport");
const session = require('express-session');
require("./passport");

// Environment setup
const port = 4000;

// Cross Origin Resource Sharing
// Enables our server to be accesed by any frontend application even with different domain
const cors = require("cors");
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin:admin@b335-rnovera.nhrd3k4.mongodb.net/course-booking", 
	{
		useNewUrlParser: true, // For parsing/reading connection string
		useUnifiedTopology: true	// Assures that our application uses mongodb latest servers when connecting with mongo database
	});
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
// process.env.PORT - online environement port
app.listen(process.env.PORT || port, () => {console.log(`API is now online on port ${process.env.PORT || port}`)});







