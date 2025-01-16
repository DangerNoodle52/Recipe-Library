const mongoose = require('mongoose');
const app = require('../server.cjs');
const recipeController = require('../controllers/recipeController.js');
const Recipe = require('../models/recipeModel.js');
const User = require('../models/userModel.js');
const supertest = require('supertest');
const request = supertest('app');

//mock
jest.mock('../models/recipeModel');
jest.mock('../models/userModel');

// create a mock user object for the test

describe('Recipe Controller Save Recipes', () => {
  const mockRecipe = {
    title: 'Chocolate chiffon cake',
    ingredients: 'chocolate',
    directions: 'mix wet and dry ingredients',
    category: 'dessert',
  };
  const mockUser = {
    _id: 'mockUserId',
    email: 'testuser@example.com',
    password: 'password123',
    savedRecipe: [],
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  User.findByIdAndUpdate = jest.fn().mockResolvedValue({
    ...mockUser,
    savedRecipe: ['someRecipeId'],
  });
  // , {savedRecipe: mockSavedRecipe._id,}
  test('saves a recipe correctly', async () => {
    // Create a user for the test

    const mockSavedRecipe = {
      _id: 'mockRecipeId',
      ...mockRecipe,
      userId: mockUser._id,
    };

    //instead of save to mongodb, it doesn't actually save
    //for the test it just immediately gives back a
    // resolved promise containing mocksavedrecipe
    const saveMock = jest.fn().mockResolvedValue(mockSavedRecipe);
    Recipe.prototype.save = saveMock;

    //mimic find and update that happens in userController

    //request
    User.findByIdAndUpdate = jest.fn().mockResolvedValue({
      ...mockUser,
      savedRecipe: [mockSavedRecipe._id],
    });
    const req = {
      body: {
        userId: mockUser._id,
        recipe: mockRecipe,
      },
    };
    //response
    // .status(201)
    // .json({ message: 'Recipe saved successfully', recipe: savedRecipe });
    const res = {
      // This mocks res.status(201)
      status: jest.fn().mockReturnThis(),
      // A mock function that returns 'res' for chaining
      // A mock function for sending JSON responses
      json: jest.fn(),
      locals: {}, //this is to enable the expect line later
    };
    //next
    const next = jest.fn();

    // mimic const data = await response.json();
    await recipeController.saveRecipes(req, res, next);

    //call controller save recipe with our req res
    ///verify! this is where we put expect
    //mimicking :
    // .status(201)
    //   .json({ message: 'Recipe saved successfully', recipe: savedRecipe });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Recipe saved successfully',
      recipe: mockSavedRecipe,
    });
    expect(res.locals.savedRecipe).toEqual(mockSavedRecipe);
  });
});
