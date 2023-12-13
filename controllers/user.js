const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");
const Enrollment = require("../models/Enrollment");



// module.exports.registerUser = function(req, res){
// }

module.exports.registerUser = (req, res) => {
	
	let newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
				// bcrypt.hashSync is to hide the actual password
		password: bcrypt.hashSync(req.body.password, 10),
		mobileNo: req.body.mobileNo
	})

	return newUser.save()
	.then((user) => res.status(201).send({ message: "Registered Successfully"}));
}

module.exports.loginUser = (req, res) => {
	return User.findOne({email: req.body.email})
	.then(result => {
		if(result == null){
			return res.status(404).send({ error: "No Email Found" });
		}
		else{
			// verify password
			// Syntax: bcrypt.compareSync(userInput, bcryptedPasswordFromDatabase)
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password); // true or false

			if (isPasswordCorrect == true) {
				// if the password matches, it will create/generate a token
				return res.status(200).send({ access : auth.createAccessToken(result)})
			} else {
				// if the password does not match it should response that it does not match "Email and/or password do not match"
				return res.status(401).send({ message: "Email and/or password do not match" });
			}
		}
	})
}

// Retrieve all users (for admin only)
module.exports.getAllUsers = (req, res) => {
	return User.find({})
	.then(result => {
		res.status(200).send({result});
	})
}


// Activity Version
/*
	module.exports.getProfile = (req, res) => {
		return User.findById(req.body._id)
		.then(result =>{
			return res.status(200).send({result})
		})	
	}
*/
module.exports.getProfile = (req, res) => {
	
	// req.user is the payload of the token upon login
	console.log("req.user display:");
	console.log(req.user);

	// return User.findOne({_id: req.user.id})
	return User.findById(req.user.id)
	.then(result =>{
		// validation
		if(!result){
				// status code - 404
			return res.status(404).send({error: 'User not found'});
		}
		else{
			result.password = "*****";
				// // status code - 200
			return res.status(200).send({result})
		}
	})	
}


module.exports.enroll = (req, res) => {
	// Proof of content of the token's payload 
	// res.send({ payload: req.user });
	// req.user is to access the information (payload) of the user from token
	if(req.user.isAdmin == true){
		return res.status(403).send(false);
		// return res.status(403).send("This service is not for admin");
	}
	else{
		let newEnrollment = new Enrollment({
			userId: req.user.id, // req.user.id comes from the payload of the token
			enrolledCourses: req.body.enrolledCourses,
			totalPrice: req.body.totalPrice	
		})

		return newEnrollment.save()
		.then(result => { return res.status(201).send(true)})
		.catch(err => res.status(500).send(err));
	}
}

// s44-s46 Activity Solution
module.exports.getEnrollments = (req, res) => {
	return Enrollment.find({userId : req.user.id})
	.then(enrollments => {
		console.log(enrollments)
		if (enrollments.length > 0) {
			return res.status(200).send({ enrollments });
		}
		return res.status(404).send({ error: 'No enrollments not found' });
	})
	.catch(err => {
		console.error("Error in fetching enrollments")
		return res.status(500).send({ error: 'Failed to fetch enrollments' })
	});
};


// Function to reset the password
module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body; // req.body.newPassword
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};



module.exports.updateAdmin = (req, res) => {
  const { userId } = req.body;

  // Check if the requesting user is an admin
  if (!req.user.isAdmin) {
    return res.status(403).send({ message: 'Permission denied. Only admins can update user roles.' });
  }

  // Update the user's role to admin
  User.findByIdAndUpdate(userId, { isAdmin: true })
    .then(() => {
      res.status(200).send({ message: 'User role updated successfully.' });
    })
    .catch((error) => {
      console.error('Error updating user role:', error);
      res.status(500).send({ message: 'Failed to update user role.' });
    });
};


















