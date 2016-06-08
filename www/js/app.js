
var app = angular.module('sps', ['ionic','ngMessages','LocalStorageModule','ngCordova','angularMoment']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
          
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    window.addEventListener('native.keyboardshow', function(){
    document.body.classList.add('keyboard-open');
  });  
  });
});
app.run(function($ionicPlatform,localStorageService) {
  $ionicPlatform.ready(function() {
    var push = new Ionic.Push({
      "debug": true,
      "onNotification": function(notification) {
                        var payload = notification.payload;
                        console.log(notification, payload);
                      },    
      "onRegister": function(data) {
                    console.log(data.token);
//                    alert(data.token);
                    localStorageService.set('DeviceToken',data.token);
                    }    
    });
 
    push.register(function(token) {
      console.log("My Device token:",token.token);
//      alert("My Device token:"+token.token);
      push.saveToken(token);  // persist the token in the Ionic Platform
    });
  });
});
app.run(function($ionicPlatform, $ionicPopup) {
        $ionicPlatform.ready(function() {
            if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.alert({
                        title: "Internet Disconnected",
                        content: "Please check your internet connection.",
                        okText: 'OK', // String (default: 'OK'). The text of the OK button.
                        okType: 'button button-block login-button' // String (default: 'button-positive'). The type of the OK button.
                    })
                    .then(function(result) {
                        if(result) {
                            ionic.Platform.exitApp();
                        }
                    });
                }
            }
        });
    });
app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('SPS');
});
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('login',{
        url: '/login',
        cache:false,
        templateUrl:'templates/login.html'
    })
    .state('signup',{
        url: '/signup',
        cache:false,
        templateUrl:'templates/signup.html'
    })
    .state('test',{
        url: '/test',
        cache:false,
        templateUrl:'templates/test.html'
    })
    .state('app',{
        cache: false,
        url: '/app',
        abstract : true,
        templateUrl:'templates/menu.html',
    })
    .state('app.dashboard',{
        url: '/dashboard',
        cache:false,
        views: {
        'sidemenuContent' :{
          templateUrl: "templates/dashboard.html"
        }
      }
    })
    .state('app.profile',{
        url: '/profile',
        cache:false,
        views: {
        'sidemenuContent' :{
          templateUrl: "templates/userprofile.html"
        }
      }
    })
    .state('app.editprofile',{
        url: '/editprofile',
        cache:false,
        views: {
        'sidemenuContent' :{
          templateUrl: "templates/editprofile.html"
        }
      }
    })
    .state('app.requests',{
        url: '/requests',
        cache:false,
        views: {
        'sidemenuContent' :{
          templateUrl: "templates/jobrequests.html"
        }
      }
    })
    .state('app.viewrequest',{
        url: '/viewrequest/:jobID',
       
        cache:false,
        views: {
        'sidemenuContent' :{
          templateUrl: "templates/viewrequests.html"
        }
      }
    })
    .state('app.estimates',{
        url: '/estimates',
         cache:false,
        views: {
        'sidemenuContent' :{
          templateUrl: "templates/estimates.html"
        }
      }
    })
    .state('app.viewestimates',{
        url: '/viewestimates/:jobname/:jobID/:customerID',
         cache:false,
        views: {
        'sidemenuContent' :{
          templateUrl: "templates/viewestimates.html"
        }
      }
    })
    .state('app.provider',{
        url: '/provider/:JobResponseId',
        views: {
        'sidemenuContent' :{
          templateUrl: "templates/provider.html"
        }
      }
    });
    $urlRouterProvider.otherwise('/login');
}]);


//Restricting the user to login page if the user is not logged in
app.run(['$rootScope', 'userAuth', '$state',
    function ($rootScope, userAuth, $state) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if(toState.name == 'signup'){
             $state.go('signup');   
        }  
        else if (toState.name !== 'login' && !userAuth.isLoggedIn()) {
          event.preventDefault();
          $state.go('login');
        }
      });
    }]
  );



// Directive to confirm password for the new user
app.directive('validPasswordC', function() {
  return {
    require: 'ngModel',
    scope: {

      reference: '=validPasswordC'

    },
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue, $scope) {

        var noMatch = viewValue != scope.reference
        ctrl.$setValidity('noMatch', !noMatch);
        return (noMatch)?noMatch:!noMatch;
      });

      scope.$watch("reference", function(value) {;
        ctrl.$setValidity('noMatch', value === ctrl.$viewValue);

      });
    }
  }
});
