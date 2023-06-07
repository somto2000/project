const Course = require('../models/course');
const enrollee = require('../models/enrollee');
const mongoose = require("mongoose");


const getMycourses = async (req, res) => {
    try {
      const courses = await Courses.find({ user: req.user.id });
      res.json(courses);
    } catch (err) {
      console.log( "failed to fetch mycourse error" );

      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  };

// Get all courses
const getAllCourses = async (req, res) => {

  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

const createCourse = async (req, res, next) => {
  const { title, description, image, level, time, video, user } =
    req.body;

  let existingEnrollee;
  try {
    existingEnrollee = await Enrollee.findById(enrollee);
  } catch (err) {
    return console.log(err);
  }
  if (!existingEnrollee) {
    return res.status(400).json({ message: "Unable to find enrollee by this id" });
  }
  const course = new Course({
    title,
    description,
    image,
    level,
    time,
    video,
    user,
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await course.save({ session });
    exitingUser.courses.push(course);
    await exitingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    res.json(course);
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ course });
};

// Get a single course
const getCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!existingEnrollee) {
      return res.status(404).json({ error: 'Enroll not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// Create a new course
// const createCourse = async (req, res, next) => {
//   try {
//     const { title, description, image, level, time, price, video, user } = req.body;
//     const course = await Course.create({ title, description });
//     res.status(201).json(course);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create course' });
//   }
// };




// Update a course
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        description,
        image,
        level,
        time,
        video,
        user,
      },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  let course;
  try {
    course = await Course.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!course) {
    return res.status(404).json({ message: "No Course Found" });
  }
  return res.status(200).json({ course });
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndDelete(courseId);
    await course.user.courses.pull(course);
    await course.user.save();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted' });
 
  }
};

const getByEnrolleeId = async (req, res, next) => {
  const enrolleeId = req.params.id;
  try {
    enrolleeCourses = await enrollee.findById(enrolleeId).populate("courses");
  } catch (err) {
    return console.log(err);
  }
  if (!enrolleeCourses) {
    return res.status(400).json({ message: "No course found" });
  }
  return res.status(200).json({ courses: enrolleeCourses });
};

module.exports = {
  getMycourses,
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getByEnrolleeId,
  getById,
};
