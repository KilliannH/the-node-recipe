var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
    $routeProvider.when('/', {
        controller:'RecipesController',
        templateUrl: 'views/recipes.html'
    })
        .when('/recipes', {
            controller:'RecipesController',
            templateUrl: 'views/recipes.html'
        })
        .when('/recipes/:id', {
            controller: 'RecipesController',
            templateUrl: 'views/recipe_details.html'
        })
        .when('/recipes/add', {
            controller:'RecipesController',
            templateUrl: 'views/add_recipe.html'
        })
        .when('/recipes/edit/:id', {
            controller: 'RecipesController',
            templateUrl: 'views/edit_recipe.html'
        })
        .otherwise({
            redirectTo: '/'
        });

});