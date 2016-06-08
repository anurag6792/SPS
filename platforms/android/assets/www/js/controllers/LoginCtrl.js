app.controller("LoginCtrl",
               ["$scope",
                "userAuth",
                '$state',
                '$ionicPopup',
                '$ionicLoading',
                'localStorageService' ,
                '$timeout',
                function($scope,userAuth,$state,$ionicPopup,$ionicLoading,localStorageService,$timeout){
//    $scope.show = false;
//    $scope.userinfo = '';
    $scope.show = function() {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                  };
  
    $scope.hide = function(){
                     $ionicLoading.hide();
                  };
    if(localStorageService.get('logged') && (localStorageService.get('userID') != null)){
        $state.go('app.dashboard');
    }
    else {
    $scope.login = function(user){
    var result = userAuth.login(user.username,user.password);//passing username and password to the login fnc in service
    $scope.show();    
    result.then(function (response) {
          
            if (response.success == "true" && response.description.RoleId == '3') {
                $scope.hide();
                console.log('In LoginCtrl : successful login');
                $scope.usesId = localStorageService.get('userID'); 
                $scope.token = localStorageService.get('DeviceToken'); 
                var sendtoken = userAuth.sendToken($scope.usesId,$scope.token);
                sendtoken.then(function (response) {
                    console.log(response);
                    if (response.success == "true"){
                        console.log('Device Token sent successfully');
                    } 
                    else if (response.success == "false"){
                        console.log('Device Token was not sent successfully');
                    }
                    else{
                        console.log('Some error was there in sending device token');
                    }
                });
                $state.go('app.dashboard'); // redirecting to the dashboard page
                //userAuth.userInfo(response);
            }
             else if(response.success == "false") {
                console.log('In LoginCtrl : unsuccessful login');
                $scope.hide(); 
                $scope.showAlert();//showing the alert on unccessful login 
             }
            else {
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
                         userAuth.destroyUser();
                         $state.go('login');
                     }   
                   });

                   alertPopup.then(function(res) {
                     console.log('Login failed');
                   });
                 };
     
    
    
    }
    }
                    
    $scope.forgotpassword = function() {
      $scope.forgot = {};
       var forgotPopup = $ionicPopup.show({
        template: '<p>Please enter Your email address</p><input class="forgot-input" type="email" ng-model="forgot.password" ><p>{{forgot.password}}</p>',
        title: 'Forgot Password',
//        subTitle: 'Please enter Your email address',
        scope: $scope,
        buttons: [
          { text: 'Cancel',
            onTap:function(e){
                return false;
            }
          },
          {
            text: '<b>Save</b>',
            type: 'button login-button',
            onTap: function(e) {
                return true;
              // add your action
            }
          }
        ]
        });
        forgotPopup.then(function(res) {
            console.log('Tapped!', res);
          });

          $timeout(function() {
             forgotPopup.close(); //close the popup after 3 seconds for some reason
          }, 10000);
        };
                    
                            
    }]);