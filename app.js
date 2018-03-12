var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const checkAuth = require('./check-auth');

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
    unique: true,
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

///////////////For Users ///////////////

// Add new user //

app.post('/user/signup', (req, res) => {
  //Checking if username already exist by querying database
  User.count({ where: {username: req.body.username}}).then(user => {
    //console.log(user)
    if(user >=1) {
      return res.status(409) 
      //error 409 means conflict, 422 means process issues.
      //Use wathever you want.
      .json({message: 'username already exist'});
    } else {
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
    }
  })
});

// Sign in //

app.post('/user/login', (req, res) => {

  User.count({ where: {username: req.body.username}}).then(userCount => {

    //We want to check first if there is one user on the array here

    if(userCount < 1) { //if not, the username is incorrect

      return res.status(401).json({message: 'Auth failed'});
    }

      User.find({ where: {username: req.body.username}}).then(user => {

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(err) {
          return res.status(401).json({message: 'Auth failed'});
        }
        if(result) {
          const token = jwt.sign({
            username: user.username,
            id: user.id
          }, "PrivateJwt", { //The super secret key i choose !! :p
            expiresIn: "1h"
          });

          return res.status(200).json({
            message: "Auth successfull",
          token: token
          });
        }

        res.status(401).json({message: 'Auth failed'});

      });
    });
  });
});

app.delete('/user/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  }).then((user) => user ? res.status(200).json(user) : res.status(404).json({error: 'unknown user'}))
}); //status 200 is the default message when the request is successfull


/////////////// For RECIPES ///////////////

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
app.post('/api/recipes/', checkAuth, function (req, res) {

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