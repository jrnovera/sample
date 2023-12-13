const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

const auth = require("../auth");
// Deconstructured the auth to directly access verify function and verifyAdmin
const {verify, verifyAdmin, isLoggedIn} = auth;

const passport = require("passport");


// "/users"
// all the routes / requirements of controllers (services)
router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);	

router.get("/all", verify, verifyAdmin, userController.getAllUsers);


router.get("/details", verify, userController.getProfile);

// router.get("/myProfile", verify , userController.getMyProfile);

router.post("/enroll", verify, userController.enroll);

//[SECTION] Route to get the user's enrollements array
router.get('/getEnrollments', verify, userController.getEnrollments);

// ChatGPT Generated Route
router.post('/reset-password', verify, userController.resetPassword);

router.put('/updateAdmin', verify, verifyAdmin, userController.updateAdmin);


// -----------------------------


// GOOGLE SIGN IN
router.get('/google', 
	passport.authenticate('google', {
	scope: ['email', 'profile'],
	prompt: "select_account"
	}
));

// Route for DECISION MAKING if success or fail
router.get('/google/callback', 
	passport.authenticate('google', {
	failureRedirect: '/users/failed'
	}),
	function(req,res){
		res.redirect('/users/success')
	}
)

router.get("/failed", (req, res) => {
	console.log('User is not authenticated');
	res.send("Failed");
});

router.get("/success", auth.isLoggedIn, (req, res) => {
	console.log('You are logged in');
	console.log(req.user);
	res.send(`Welcome ${req.user.displayName}`)
});

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if(err){
			console.log('Error while destroying session', err);
		}else{
			req.logout(()=>{
				console.log('You are logged out');
				res.redirect('/courses');
			})
		}
	})
})








module.exports = router;