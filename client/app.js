var myApp = angular.module('myApp', [])

myApp.config(function(){
//use to init
});

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