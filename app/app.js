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

   	 var ref = firebase.database().ref().child('checklist');
	  // download the data into a local object
	 $scope.items = $firebaseArray(ref);

    $scope.removeItem = function(id){

    	$scope.items.$remove(id);
    };

    $scope.addToList = function(){

    	if ($scope.listItem) {

	    	$scope.items.$add({name:$scope.listItem, wanted:false});
    	}

    	$scope.listItem = null;


    };
});
