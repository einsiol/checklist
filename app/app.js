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




checklistApp.controller('ListCtrl', function($scope, $timeout, $mdDialog, $firebaseObject, $firebaseArray) {

	//if(!localStorage.checkList) localStorage.setItem('checkList', '[]');

	// console.log(localStorage.getItem('checkList'))

   	 var ref = firebase.database().ref().child('checklist');
	  // download the data into a local object
	 $scope.items = $firebaseArray(ref);


	  // synchronize the object with a three-way data binding
	  // click on `index.html` above to see it used in the DOM!
	 
	  //$scope.data = [];

    $scope.updateList = function(event){

    	// console.log(event);

    	console.log('update');

    	$scope.items.$save();

    	console.log($scope.items);

    	//localStorage.setItem('checkList', angular.toJson($scope.items));
    }

    $scope.removeItem = function(id){
    	//console.log(index);

    	$scope.items.$remove(id);

    	//localStorage.setItem('checkList', angular.toJson($scope.items));
    };

    $scope.addToList = function(){

    	//console.log($scope.listItem);
    	//console.log($scope.items);
    	console.log($scope.items);

    	if ($scope.listItem) {

	    	$scope.items.$add({name:$scope.listItem, wanted:false});
	    	//$scope.checklist.$save({name:$scope.listItem, wanted:false});

	    	//localStorage.setItem('checkList', angular.toJson($scope.items));
    	}

    	$scope.listItem = null;


    };
});
