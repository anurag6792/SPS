
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
    .state('app.estimates',{
        url: '/estimates',
        views: {
        'sidemenuContent' :{
          templateUrl: "templates/estimates.html"
        }
      }
    })
    .state('app.provider',{
        url: '/provider',
        views: {
        'sidemenuContent' :{
          templateUrl: "templates/provider.html"
        }
      }
    });
    $urlRouterProvider.otherwise('/login');
}]);

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
