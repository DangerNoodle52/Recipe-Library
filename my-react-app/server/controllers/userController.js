const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    // Brings the things from my body (the inputs)
    const { email, password } = req.body;

    if (!email || !password) {
      console.error('Missing properties in request body');

      return next({
        log: 'Missing required properties in request body',
        status: 400,
        message: 'Missing required properties: email or password ',
      });
    }

    //Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Email already exists');
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Create a new user and return in a response
    const user = new User({
      email,
      password,
    });

    await user.save();
    res.locals.newUser = user;

    next();
  } catch (err) {
    next(err);
  }
};

userController.verifyUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    // Search for the email
    const user = await User.findOne({ email });

    // checks if the email exists
    if (!user) {
      console.error('User not found');
      return next({
        log: 'User not found',
        status: 404,
        message: 'User not found ',
      });
    }

    // compare the passwords
    const isPassValid = await user.comparePassword(password);

    // checks if the password its invalid
    if (!isPassValid) {
      console.error('Invalid Password');
      return next({
        log: 'Invalid Password',
        status: 401,
        message: 'Invalid Password ',
      });
    }

    req.session.userId = user._id;
    res.status(200).json({
      authenticated: true,
      user: {
        email: user.email,
        _id: user._id,
      },
    });
    // Response with the user information
    res.status(200).json({ user: { id: user._id, email: user.email } });
    // res.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

userController.savedRecipes = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // search for the user id
    const user = await User.findById(userId);

    // checks if the user exists
    if (!user) {
      return next({
        log: 'User not found',
        status: 404,
        message: 'User not found ',
      });
    }

    res.locals.savedRecipes = user.savedRecipes;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
