const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000

const MONGO_URI = "mongodb://localhost:27017/cooker"
app.use(express.json())
mongoose.connect(MONGO_URI, {  useNewUrlParser: true, useUnifiedTopology: true  })
.then(() => console.log("hola mongo")).catch((err) => console.error("oopsie mongo", err));

const recipeSchema = new mongoose.Schema({
  title: String,
  calories_per_serving : Number,
  cook_time : Number,
  desc : String,
  directions : [String],
  ingredients : [
    {
      name : String,
      quantity : {
        amont : Number,
        unit : String
      }
    }
  ],
  likes : [Number],
  likes_count : Number,
  prep_time : Number,
  rating : [Number],
  rating_avg : Number,
  servings : Number,
  tags : [String],
  type : String
})


const Recipe = mongoose.model('Recipe', recipeSchema, 'recipes');

async function getAllRecipes()
{
  try {
    const recipes = await Recipe.find();
    return recipes;

  } catch(err) {
      console.error(` Error on recipes fetch ${err} `);
  }
}

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await getAllRecipes();

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error : "Oopsie error fetching these recipes" });
  } 
})

app.post('/recipes', async (req, res) => 
{
  try  { 
    const rec = new Recipe(req.body);
    await rec.save();
    res.status(201).json(rec);

  } catch (err) 
  {
    res.status(500).json({ error : `OOpsie ${err}` })
  }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
