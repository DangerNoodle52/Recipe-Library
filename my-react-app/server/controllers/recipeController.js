const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

const recipeController = {};

recipeController.getRecipes = async (req, res, next) => {
  try {
    const response = await fetch(
      'https://www.themealdb.com/api/json/v1/1/random.php'
    );
    // www.themealdb.com/api/json/v1/1/search.php?s="variable"
    //www.themealdb.com/api/json/v1/1/search.php?f=a

    if (!response) {
      console.error('Failed to fetch data');
      next({
        log: 'Failed to fetch data',
        status: 404,
        message: 'Failed to fetch data',
      });
    }

    const data = await response.json();

    res.locals.recipes = data;
    //Example -> res.locals.user = { username: user.username, role: user.role_description, id: user.id };
    console.log(res.locals.recipes);
    next();
  } catch (err) {
    next(err);
  }
};

// This is going to be a POST request in server
recipeController.saveRecipes = async (req, res, next) => {
  try {
    const { userId, recipe } = req.body;

    if (!userId || !recipe) {
      return res.status(400).json({ message: 'Missing userId or recipe data' });
    }

    const newRecipe = new Recipe({ ...recipe, userId });
    const savedRecipe = await newRecipe.save();

    await User.findByIdAndUpdate(userId, {
      $push: { savedRecipe: savedRecipe._id },
    });

    res
      .status(201)
      .json({ message: 'Recipe saved successfully', recipe: savedRecipe });
  } catch (err) {
    console.error('Error in saveRecipes', err);
    next(err);
  }
  // if (!recipe || !userId) {
  //   return next({
  //     log: 'Invalid request body',
  //     status: 400,
  //     message: 'Invalid request body',
  //   });
  // }
  // try {
  //   const { title: strMeal } = req.body;
  //   const userId = req.session.userId;
  //   const newRecipe = new Recipe({ title: strMeal, userId });
  //   await newRecipe.save();
  //   next();
  // } catch (err) {
  //   res.status(500).json({ message: 'Failed to save recipe' });
  // }
};

recipeController.searchRecipesByName = async (req, res, next) => {
  try {
    const { title } = req.params;

    if (!title) {
      console.error('No title provided in request params');
      next({
        log: 'No title provided in request params',
        status: 404,
        message: 'No title provided in request params',
      });
    }

    const url = `www.themealdb.com/api/json/v1/1/search.php?s=${title}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Failed to fetch data');
      next({
        log: 'Failed to fetch data',
        status: 404,
        message: 'Failed to fetch data',
      });
    }
    const data = await response.json();
    res.locals.recipebyName = data;
    console.log('recipe:', res.locals.recipeName);
  } catch (err) {
    next(err);
  }
};

recipeController.filterByArea = async (req, res, next) => {
  try {
    //www.themealdb.com/api/json/v1/1/filter.php?a=Canadian
    const { area } = req.params;

    if (!title) {
      console.error('No title provided in request params');
      next({
        log: 'No title provided in request params',
        status: 404,
        message: 'No title provided in request params',
      });
    }

    const url = `www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Failed to fetch data');
      next({
        log: 'Failed to fetch data',
        status: 404,
        message: 'Failed to fetch data',
      });
    }
    const data = await response.json();
    res.locals.recipebyArea = data;
    console.log('recipe:', res.locals.recipeArea);
  } catch (err) {
    next(err);
  }
};

module.exports = recipeController;
