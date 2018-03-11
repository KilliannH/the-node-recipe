var myApp = angular.module('myApp', ['ngRoute']);


myApp.config(['$routeProvider', function($routeProvider){
    
    $routeProvider
        .when('/', {
            templateUrl: 'views/recipes.html'
        })
        .when('/recipes/details/:id', {
            templateUrl: 'views/recipe-details.html',
            controller: 'appController'
        })
        .when('/recipes/add', {
            templateUrl: 'views/add-recipe.html',
            controller: 'appController'
        })
        .when('/recipes/edit/:id', {
            templateUrl: 'views/edit-recipe.html',
            controller: 'appController'
        })
        .otherwise({
            redirecTo: '/'
        });
}]);
//use to init

myApp.run(function(){
//use during app runs
});

myApp.controller('appController', ['$scope', function($scope){
    console.log("appController on the go...")

    $scope.recipes = [
        {
            id: 1,
            name: "firstRecipe",
            ingredients: "tomato",
            directions: "do it",
            img_url: "tomatoPic",
            createdAt: "10-10-10",
            createdAt: "10-10-10"
        }
    ];

}]);