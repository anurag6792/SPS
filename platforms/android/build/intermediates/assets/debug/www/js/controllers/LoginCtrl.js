app.controller("LoginCtrl",["$scope","userAuth",'$state','$ionicPopup','$ionicLoading',function($scope,userAuth,$state,$ionicPopup,$ionicLoading){
//    $scope.show = false;
    $scope.userinfo = '';
    $scope.show = function() {
                    $ionicLoading.show({
                      template: 'loading<ion-spinner icon="spiral"></ion-spinner>'
                    });
                  };
  
    $scope.hide = function(){
                     $ionicLoading.hide();
                  };
    $scope.login = function(user){
    var result = userAuth.login(user.username,user.password);//passing username and password to the login fnc in service
       
    result.then(function (response) {
           $scope.show(); 
            if (response.success == "true") {
                $scope.hide();
                console.log('In LoginCtrl : successful login');
                $state.go('app.dashboard'); // redirecting to the dashboard page
                //userAuth.userInfo(response);
            }
             else if(response.success == "false") {
                console.log('In LoginCtrl : unsuccessful login');
                $scope.hide(); 
                $scope.showAlert();//showing the alert on unccessful login 
             }
            });
    $scope.showAlert = function() {
                   var alertPopup = $ionicPopup.alert({
                     title: 'Login Failed',
                     template: 'Invalid Username or Password',
                     okText:'OK',
                     okType:'button button-block login-button',
                     onTap: function(e){
                         $state.go('login');
                     }   
                   });

                   alertPopup.then(function(res) {
                     console.log('Login failed');
                   });
                 };   
    
    }
    }]);