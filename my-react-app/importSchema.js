const mongoose = require('mongoose');
require('dotenv').config();

// Define the User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email.`,
    },
  },
  password: { type: String, required: true },
  savedRecipe: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
});

// Define the Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: String, required: false },
  directions: { type: String, required: false },
  category: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// Models
const User = mongoose.model('User', userSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Connected to MongoDB');

    //Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});

    // Seed some sample data
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
    });
    const savedUser = await user.save();

    const recipe = new Recipe({
      title: 'Spaghetti Bolognese',
      ingredients: 'Spaghetti, ground beef, tomato sauce',
      directions: 'Cook pasta. Prepare sauce. Mix together.',
      category: 'Italian',
      userId: savedUser._id,
    });

    await recipe.save();

    console.log('Schema and sample data imported successfully!');
    process.exit(0); // Exit the script
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
