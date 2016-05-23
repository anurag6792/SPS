app.controller('SidemenuCtrl',[
    '$scope',
    '$state',
    'localStorageService',
    'userAuth',
    '$ionicPopup',
    function($scope ,$state ,localStorageService ,userAuth ,$ionicPopup ){
        
    $scope.userdetails = {};
    $scope.userId =  localStorageService.get('userID');     
    var getuserdetails = userAuth.userDetails($scope.userId);    
    getuserdetails.then(function(response){
        if (response.success == "true") {
            $scope.userdetails = response;
            console.log('Added Consumer details to the SidemenuCtrl in userdetails');
        }
        else{
            userAuth.destroyUser();
            $state.go('login');
        }
    });
//        
//    $scope.userdetails = localStorageService.get('userprofile');
//    console.log('Added Consumer details to the SidemenuCtrl in userdetails');
//    
    // Logout Function
    $scope.logout= function(){
      $scope.showConfirm(); // Showing confirmation for logout  
    };
    //Logout Confirmation Function    
    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
        title: 'Logout',
        template: 'Are you sure you want to exit this app?',
         buttons: [{ 
            text: 'Cancel',
            type: 'button-default',
            onTap: function() {
              return false; //returning false when the consumer presses cancel
            }
          }, {
            text: 'Exit',
            type: 'login-button',
            onTap: function() {
              if($scope.userdetails.success == 'true'){
                    userAuth.destroyUser(); //Destryoing the user details when user presses exit and redirecting to login page
                    $state.go('login',{},{reload:true});
                   return true;
                }         
            }
          }]    
    });

   confirmPopup.then(function(res) {
     if(res){
         console.log("consumer Logged out of the app");
     }
     else{
         console.log("consumer cancelled logout");
     }  
   });
 };
   
}]);