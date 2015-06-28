angular.module('app', ['ui.router', 'ui.bootstrap'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  });
  $urlRouterProvider.otherwise('/');
})

/*
// Home Controller doesn't do anything now. 
.controller('HomeCtrl', function($scope) {
	$scope.exist = true; 
	$scope.timer = 100;
	$scope.currTime = 30; 
	$scope.timeLeft = function () {
		return $scope.timer - $scope.currTime; 
	}
});
*/
.controller('HomeCtrl', function TimeCtrl($scope, $timeout) {
    //-------------------------------------------------------------------------
    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000 //ms
    // Reset to show the latest Date.now() every 1 second 
    var tick = function() {
        $scope.clock = Date.now() // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    // Start the timer
    $timeout(tick, $scope.tickInterval);
    //-------------------------------------------------------------------------
    $scope.counter = 10;
    var mytimeout = 0;
    $scope.onTimeout = function(){
        $scope.counter--;
	if ($scope.counter <= 0) 
	{
		$timeout.cancel(mytimeout); // cancel the timeout  
	}
	else 
	{
		mytimeout = $timeout($scope.onTimeout,1000);
	}
    }
    mytimeout = $timeout($scope.onTimeout,1000);

    $scope.stop = function(){
        $timeout.cancel(mytimeout);
    }
    $scope.start = function() {
	    // Cancel any previous mytimeout request  
	    $timeout.cancel(mytimeout);
	    $scope.counter = 15; // initialize to 15 
	    mytimeout = $timeout($scope.onTimeout,1000);
    }

    //-------------------------------------------------------------------------
    // To Plot Progress Bar 
      $scope.max = 200;

  $scope.random = function() {
    var value = Math.floor((Math.random() * 100) + 1);
    var type;

    if (value < 25) {
      type = 'Too Cold';
    } else if (value < 50) {
      type = 'Higher';
    } else if (value < 75) {
      type = 'Just Good';
    } else {
      type = 'Too Hot';
    }

    $scope.showWarning =true ;

    $scope.dynamic = value;
    $scope.type = type;
  };
  $scope.random();

}); 
