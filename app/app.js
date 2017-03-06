var checklistApp = angular.module('BlankApp', ['ngMaterial', 'firebase']);


checklistApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});




checklistApp.controller('ListCtrl', function($scope, $mdDialog, $firebaseObject) {

	$scope.items = [];
	//if(!localStorage.checkList) localStorage.setItem('checkList', '[]');

	// console.log(localStorage.getItem('checkList'))

   	 var ref = firebase.database().ref().child("data");
	  // download the data into a local object
	  var syncObject = $firebaseObject(ref);
	  // synchronize the object with a three-way data binding
	  // click on `index.html` above to see it used in the DOM!
	  syncObject.$bindTo($scope, "items");

    $scope.updateList = function(event){

    	// console.log(event);

    	//localStorage.setItem('checkList', angular.toJson($scope.items));
    }

    $scope.removeItem = function(index){
    	//console.log(index);

    	$scope.items.splice(index, 1);

    	//localStorage.setItem('checkList', angular.toJson($scope.items));
    };

    $scope.addToList = function(){

    	//console.log($scope.listItem);
    	//console.log($scope.items);


    	if ($scope.listItem) {

	    	$scope.items.push({name:$scope.listItem, wanted:false});

	    	//localStorage.setItem('checkList', angular.toJson($scope.items));
    	}

    	$scope.listItem = null;


    };
});
