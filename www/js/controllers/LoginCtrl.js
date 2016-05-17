app.controller("LoginCtrl",["$scope","userAuth",'$state','$ionicPopup',function($scope,userAuth,$state,$ionicPopup){
    $scope.show = false;
    $scope.userinfo = '';
    $scope.login = function(user){
    var result = userAuth.login(user.username,user.password);
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
        result.then(function (response) {

            if (response.success == "true") {            
                console.log('success');
                $state.go('app.dashboard');
                userAuth.userInfo(response);
            }

            else if(response.success == "false") {
                console.log('no success');
                $scope.showAlert(); 
               
            }

        });
        
    }
}]);