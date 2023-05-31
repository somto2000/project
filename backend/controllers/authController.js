const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Enrollee = require('../models/enrollee');

const registerEnrollee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingEnrollee = await Enrollee.findOne({ email });
    if (existingEnrollee) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new enrollee
    const enrollee = new Enrollee({ name, email, password: hashedPassword });
    await enrollee.save();
    console.log(enrollee);

    // Generate a JWT token
    const token = jwt.sign({ enrolleeId: enrollee._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(201).json({
      success: true,
      enrollee,
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register enrollee' });
  }
};

const loginEnrollee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the enrollee exists
    const enrollee = await Enrollee.findOne({ email });
    if (!enrollee) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, enrollee.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ enrolleeId: enrollee._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login enrollee' });
  }
};

const logoutEnrollee = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(400).json({ message: 'Logged out successfully' });
};


module.exports = {
  registerEnrollee,
  loginEnrollee,
  logoutEnrollee,
};
