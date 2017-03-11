var checklistApp = angular.module('BlankApp', ['ngMessages', 'ngMaterial', 'ngCookies', 'ngRoute', 'firebase']);


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

checklistApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginController',
     })
   .when('/register', {
    templateUrl: 'createAccount.html',
    controller: 'LoginController',
   })
   .otherwise({
      templateUrl: 'checklists.html',
    });

  // configure html5 to get links working on jsfiddle
  //$locationProvider.html5Mode(true);
});

var checklistData = firebase.database().ref().child('checklist');
var userData;
var presenceRef;
var onDisconnectRef;
//checklistData.onDisconnect().set("I disconnected!");

checklistApp.controller('MainController', function($scope, $rootScope, $timeout, $mdDialog, $cookies, $location) {

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
         // console.log(user.displayName);
         $cookies.put('user', user.displayName);

         console.log(user)

         $rootScope.user = $cookies.get('user');

         checkIfUserIsLoggedIn();

      } else {
        $cookies.remove('user');
         checkIfUserIsLoggedIn();
      }
    }, function(error){
        console.log(error)
    });

   
   // console.log($rootScope.user)
   function checkIfUserIsLoggedIn() {
     if (!$rootScope.user && $location.path() != '/register'){

        $location.path('/login');
        //console.log('redirect');

    } else {
        usersData = firebase.database().ref('users/' + $rootScope.user);
        presenceRef = firebase.database().ref('users/' + $rootScope.user + '/disconnectmessage');

    }

    console.log($rootScope.user)

    if($rootScope.user && $location.path() == '/login') {
        $location.path('/');
        //console.log('redirect if logged in')
    }

   }

    

    //console.log($rootScope.user);
    
 });

checklistApp.controller('LoginController', function($scope, $rootScope, $timeout, $mdDialog, $cookies, $location) {

    $scope.registerUser = function(){

        $scope.serverError = null;

        firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).then(function(user) {
            //console.log('')

            user.updateProfile({
                displayName: $scope.name
            }).then(function() {
                 $cookies.put('user', firebase.auth().currentUser.displayName);
                 $rootScope.user = firebase.auth().currentUser.displayName;

                 console.log('success')

                 $location.path('/');
                 
            }, function(error) {
                // An error happened.
            });        

            
           
            
           // logUser(user); // Optional
        }, function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            $scope.serverError = error.message;
        });
    }

    $scope.serverError = 'my message';

    $scope.loginUser = function(){
        firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).then(function(user) {
    
            $cookies.put('user', user.displayName);
            $rootScope.user = user.displayName;

            $location.path('/');
          
            
           
            
           // logUser(user); // Optional
        }, function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            $scope.showErrorMessage = true;
            $scope.serverError = error.message;

            console.log(error.message)
        });
    }
    
 });



checklistApp.controller('ListCtrl', function($scope, $rootScope, $timeout, $mdDialog, $firebaseObject, $firebaseArray) {

   	 
	  // download the data into a local object
	 $scope.items = $firebaseArray(checklistData);

     //items = $scope.items;
	 

    $scope.addToList = function(){

    	if ($scope.listItem) {

	    	$scope.items.$add({name:$scope.listItem, wanted:false, user:$rootScope.user});
    	}

    	$scope.listItem = null;


    };
});
