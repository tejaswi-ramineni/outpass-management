const express = require('express');
const { studentSignup, studentLogin } = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getStudentProfile } = require('../controllers/studentController');

const router = express.Router();

// Authentication Routes
router.post('/signup', studentSignup);
router.post('/login', studentLogin);

// Protected Routes (Only Students Can Access)
router.get('/profile', verifyToken, authorizeRoles('student'), getStudentProfile);

module.exports = router;


// BEFORE CONTROLLERS
// router.post('/signup', async (req, res) => {
//   const { name, email, password } = req.body;
//   const student = new Student({ name, email, password });
//   await student.save();
//   res.status(201).send('Student registered successfully');
// });

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const student = await Student.findOne({ email });

//   if (!student || student.password !== password) {
//     return res.status(400).send('Invalid credentials');
//   }

//   res.status(200).send('Login successful');
// });

module.exports = router;
