// // How is This Response Generated?
// // This response is usually created in your authentication route (e.g., /login). Below is how it typically works:

// // Backend Flow (Step-by-Step)
// // User sends login credentials (email & password) in a POST request.
// // Backend verifies the user:
// // Finds the user in the database (MongoDB).
// // Compares the hashed password (if stored securely).
// // If authentication is successful:
// // Generates a JWT Token (jsonwebtoken package in Node.js).
// // Sends back the user's details excluding the password.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Warden = require('../models/Warden');
const Admin = require('../models/Admin');
const JWT_SECRET = process.env.JWT_SECRET;

// Common Signup Function (Handles Different Models)
const signup = async (req, res, model, fields) => {
    const userData = {};
    fields.forEach(field => {
        if (req.body[field]) userData[field] = req.body[field];
    });

    try {
        // Check if user already exists (based on unique field)
        const existingUser = await model.findOne({ [fields[0]]: req.body[fields[0]] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        userData.password = await bcrypt.hash(req.body.password, 10);

        // Create User
        const user = await model.create(userData);

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// Common Login Function (Handles Different Models)
const login = async (req, res, model, uniqueField) => {
    const { password } = req.body;
    const query = { [uniqueField]: req.body[uniqueField] };

    try {
        // Find User
        const user = await model.findOne(query);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// ✅ Signup Endpoints
exports.studentSignup = (req, res) => signup(req, res, Student, ['regId', 'name', 'hostelBlock', 'password']);
exports.wardenSignup = (req, res) => signup(req, res, Warden, ['wardenId', 'hostelBlock', 'password']);
exports.adminSignup = (req, res) => signup(req, res, Admin, ['name', 'email', 'password']);

// ✅ Login Endpoints
exports.studentLogin = (req, res) => login(req, res, Student, 'regId');
exports.wardenLogin = (req, res) => login(req, res, Warden, 'wardenId');
exports.adminLogin = (req, res) => login(req, res, Admin, 'email');


// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const Student = require('../models/Student');
// const Warden = require('../models/Warden');
// const Admin = require('../models/Admin');

// // JWT Secret Key
// const JWT_SECRET = process.env.JWT_SECRET || 'yourjwtsecretkey';

// // =====================================
// // ✅ Student Signup
// // =====================================
// exports.studentSignup = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if the student already exists
//     const existingStudent = await Student.findOne({ email });
//     if (existingStudent) {
//       return res.status(400).json({ message: 'Student already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new student
//     const student = await Student.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: 'student'
//     });

//     // Generate a token
//     const token = jwt.sign({ id: student._id, role: student.role }, JWT_SECRET, {
//       expiresIn: '1d'
//     });

//     // Send the response (excluding password)
//     res.status(201).json({ token, student });
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong', error });
//   }
// };

// // =====================================
// // ✅ Student Login
// // =====================================
// exports.studentLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if student exists
//     const student = await Student.findOne({ email });
//     if (!student) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Compare the password
//     const isMatch = await bcrypt.compare(password, student.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate a token
//     const token = jwt.sign({ id: student._id, role: student.role }, JWT_SECRET, {
//       expiresIn: '1d'
//     });

//     res.status(200).json({ token, student });
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong', error });
//   }
// };

// // Request sent to /login
// // Server finds the user in MongoDB (Student.findOne({ email })).
// // Checks the password (using bcrypt.compare()).
// // If successful, generates a JWT token and returns

// // =====================================
// // ✅ Warden Signup/Login
// // =====================================
// exports.wardenSignup = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingWarden = await Warden.findOne({ email });
//     if (existingWarden) {
//       return res.status(400).json({ message: 'Warden already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const warden = await Warden.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: 'warden'
//     });

//     const token = jwt.sign({ id: warden._id, role: warden.role }, JWT_SECRET, {
//       expiresIn: '1d'
//     });

//     res.status(201).json({ token, warden });
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong', error });
//   }
// };

// exports.wardenLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const warden = await Warden.findOne({ email });
//     if (!warden) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, warden.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: warden._id, role: warden.role }, JWT_SECRET, {
//       expiresIn: '1d'
//     });

//     res.status(200).json({ token, warden });
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong', error });
//   }
// };

// // =====================================
// // ✅ Admin Signup/Login
// // =====================================
// exports.adminSignup = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ message: 'Admin already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const admin = await Admin.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: 'admin'
//     });

//     const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
//       expiresIn: '1d'
//     });

//     res.status(201).json({ token, admin });
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong', error });
//   }
// };

// exports.adminLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
//       expiresIn: '1d'
//     });

//     res.status(200).json({ token, admin });
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong', error });
//   }
// };
