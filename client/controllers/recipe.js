var myApp = angular.module('myApp');

myApp.controller('RecipesController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
    console.log("RecipesController loaded...");

    $scope.getRecipes = function() {
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
        $http.post('/api/recipes/', $scope.recipe).then(function (response) { //C'est là où on se connecte au back-hand
            //En second paramettre, on met ce qu'on veut post, ici $scope.recipe
            window.location.href='#!/recipes';
        });

    }

    $scope.updateRecipe = function() {
        var id= $routeParams.id;
        $http.put('/api/recipes/' + id, $scope.recipe).then(function (response) {
            window.location.href='#!/recipes'; // On redirect le user vers la mainPage.
        });

    }

    $scope.removeRecipe = function(id) { //on passe le id en praramètre
        $http.delete('/api/recipes/' + id, $scope.recipe).then(function (response) {
            //on ne pass in rien du tout (pas d'attributs du book when delete) donc on s'en fout du $scope.book
            window.location.href='#!/recipes';
        });

    }

}]);