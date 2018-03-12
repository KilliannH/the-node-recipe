var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());

//Connect to Postgre
const sequelize = new Sequelize('postgres://kikipostgres:postgres@localhost:5432/recipe-db');

//Let's checkout connection
    sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

//Init model (in this same file because it's a simple single page app)
const Recipe = sequelize.define('recipe', {

    name: {
      type: Sequelize.STRING
    },
    ingredients: {
      type: Sequelize.TEXT
    },
    directions: {
        type: Sequelize.TEXT
    },
    img_url: {
        type: Sequelize.TEXT
    }

});


const User = sequelize.define('user', {

  username: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [1,50]
		}
  },
  
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
    }
  }

})

//Let's do some api stuff here

// For Users //
app.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      return res.status(500).json({error: err});
    } else {
      User.create({
        username: req.body.username,
        password: hash
    
      }).then((user) => res.json(user))
    }
  });
});


// For RECIPES //

/// DEFAULT GET HERE ///
app.get('/api/recipes', function (req, res) {

    Recipe.findAll().then(recipes => {
        res.json(recipes)
      })
});

/// GET RECIEPE BY ID ///
app.get('/api/recipes/:id', function (req, res) {

  Recipe.find({
    where: {
      id: req.params.id
    }
  }).then((recipe) => recipe ? res.json(recipe) : res.status(404).json({error: 'unknown recipe'}))
});

/// POST NEW RECIPE ///
app.post('/api/recipes/', function (req, res) {

  Recipe.create({
    name: req.body.name,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
    img_url: req.body.img_url

    //My bad, id, createdAt & updatedAt are filled automatically on post.
    //Very cool :)

  }).then((recipe) => res.json(recipe))
});

/// UPDATE RECIPE ///
app.put('/api/recipes/:id', function (req, res) {

  Recipe.find({
    where: {
      id: req.params.id
    }

  }).then((recipe) => {
    if(recipe){
      recipe.updateAttributes({
        name: req.body.name,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        img_url: req.body.img_url

      }).then(function(recipe) {
        res.send(recipe)
      })
    } else
    res.status(404).json({error: "unknown recipe"})
    })
});

/// DELETE RECIPE ///
app.delete('/api/recipes/:id', function (req, res) {

  Recipe.destroy({
    where: {
      id: req.params.id
    }
  }).then((recipe) => recipe ? res.json(recipe) : res.status(404).json({error: 'unknown recipe'}))
});


app.listen(3000);
console.log('Running on port 3000...');