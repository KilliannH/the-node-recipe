var myApp = angular.module('myApp', ['ngRoute']);


myApp.config(['$routeProvider', function($routeProvider){
    
    $routeProvider
        .when('/', {
            templateUrl: 'views/recipes.html',
            controller: 'appController'
        })
        .when('/details/:id', {
            templateUrl: 'views/recipe-details.html',
            controller: 'appController'
        })
        .when('/add', {
            templateUrl: 'views/add-recipe.html',
            controller: 'appController'
        })
        .when('/edit/:id', {
            templateUrl: 'views/edit-recipe.html',
            controller: 'appController'
        })
        .when('/user/signup', {
            templateUrl: 'views/signup.html',
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

myApp.controller('appController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    console.log("appController on the go...")

    //For Users //
    $scope.signup = function() {
        $http.post('/user/signup', $scope.user).then(function (response) {

            window.location.href='#!/';
        });
    }

    //have to implement delete later on.
    
    //For Recipes //
    $scope.getRecipes = function(){

       $http.get('/api/recipes').then(function(response){
        $scope.recipes = response.data;
        });
    }

    $scope.getRecipe = function() {
        var id= $routeParams.id;
        $http.get('/api/recipes/' + id).then(function(response){
            $scope.recipe = response.data;
        });
    }

    $scope.addRecipe = function() {
        $http.post('/api/recipes/', $scope.recipe).then(function (response) {
            //En second paramètre, l'objet du scope qui va contenir de la data,
            //ici recipe.

            window.location.href='#!/';
        });
    }

    $scope.updateRecipe = function() {
        var id= $routeParams.id;
        $http.put('/api/recipes/' + id, $scope.recipe).then(function (response) {
                
            window.location.href='#!/';
        });
    }

    $scope.deleteRecipe = function(id) {
        $http.delete('/api/recipes/' + id, $scope.recipe).then(function (response) {

            window.location.href='#!/';
        });
    }

}]);