const Course = require("../models/Course");


module.exports.addCourse = (req,res) => {
	// Validation - the course should be not existing before adding to database
	Course.findOne({name: req.body.name})
	.then(result => {
		if(result){
			return res.status(409).send({error: "Course already exist"})
		}
		else{
			let newCourse = new Course({
				name: req.body.name,
				description: req.body.description,
				price: req.body.price
			})
			return newCourse.save()
			.then(savedCourse => res.status(201).send({savedCourse}))
			.catch(err => {
				console.error("Error in saving the course", err)
				return res.status(500).send({error: "Failed to save the course"})
				// return res.status(500).send(err)
			})
		}
	})
}

module.exports.getAllCourses = (req,res)=>{
	return Course.find({})
	.then(courses => { res.status(200).send({courses})})
	// .catch(error => res.status(500).send(error)); 
	.catch(error => res.status(500).send({error: "Error finding all courses"})); 
}

module.exports.getAllActive = (req, res) => {
    Course.find({ isActive : true })
    .then(courses => {
        if (courses.length > 0){
            return res.status(200).send({ courses });
        }
        else {
            return res.status(200).send({ message: 'No active courses found.' })
        }
    })
    .catch(err => res.status(500).send({ error: 'Error finding active courses.' }));
};

// Getting specific course
module.exports.getCourse = (req, res) => {
	Course.findById(req.params.courseId)
	.then(course => {
		if(!course){
			return res.status(404).send({error: "Course not found"})
		}
		else{
			return res.status(200).send({course})
		}
	})
	.catch(err => {
		console.error("Error in retrieving the course", err);
		return res.status(500).send({error: 'Failed to fetch course'});
	})
}


module.exports.updateCourse = (req, res) => {
	let updatedCourse = {
		name: req.body.name, // new name
		description: req.body.description,  // new description
		price: req.body.price // new price
	}
	return Course.findByIdAndUpdate(req.params.courseId, updatedCourse)
	.then(result => {
		if(!result){
			return res.status(404).send({ error: 'Course not found' });
		}
		else{
			return res.status(200).send(
				{ 
	        	message: 'Course updated successfully', 
	        	updatedCourse: updatedCourse 
	        	}
	        );
		}
	})
	.catch(err => {
		console.error("Error in updating a course: ", err)
		return res.status(500).send({ error: 'Error in updating a course.' });
	});
}


// s44-s46 Activity Solution
module.exports.archiveCourse = (req, res) => {

    let updateActiveField = {
        isActive: false
    }
    if (req.user.isAdmin == true){
        return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
        .then(archiveCourse => {
            if (!archiveCourse) {
            	return res.status(404).send({ error: 'Course not found' });
            }
            return res.status(200).send({ 
            	message: 'Course archived successfully', 
            	archiveCourse: archiveCourse 
            });
        })
        .catch(err => {
        	console.error("Error in archiving a course: ", err)
        	return res.status(500).send({ error: 'Failed to archive course' })
        });
    }
    else{
        return res.status(403).send(false);
    }
};

module.exports.activateCourse = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    if (req.user.isAdmin == true){
        return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
        .then(activateCourse => {
            if (!activateCourse) {
            	return res.status(404).send({ error: 'Course not found' });
            }
            return res.status(200).send({ 
            	message: 'Course activated successfully', 
            	activateCourse: activateCourse
            });
        })
        .catch(err => {
        	console.error("Error in activating a course: ", err)
        	return res.status(500).send({ error: 'Failed to activating a course' })
        });
    }
    else{
        return res.status(403).send(false);
    }
};




module.exports.searchCoursesByPrice = (req, res) => {
  const { minPrice, maxPrice } = req.body;

  // Validate input parameters
  if (minPrice === undefined || maxPrice === undefined) {
    return res.status(400).send({ error: 'minPrice and maxPrice are required in the request body' });
  }

  // Query the database for courses within the given price range
  Course.find({
    price: { $gte: minPrice, $lte: maxPrice },
  })
    .then(courses => res.status(200).send({ courses }))
    .catch(error => res.status(500).send({ error: 'Error searching courses by price range' }));
};





