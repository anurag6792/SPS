app.controller('ProfileCtrl',['$scope','userAuth','localStorageService','$state',function($scope,userAuth,localStorageService,$state){
    $scope.profile = {};
    
    $scope.userId =  localStorageService.get('userID');     
    var getuserdetails = userAuth.userDetails($scope.userId);    
    getuserdetails.then(function(response){
        if (response.success == "true") {
            $scope.profile = response;
             console.log('Added consumer details to the ProfileCtrl in profile') 
        }
        else{
            userAuth.destroyUser();
            $state.go('login');
        }
    });
//    $scope.profile = localStorageService.get('userprofile');
//    console.log('Added consumer details to the ProfileCtrl in profile') 
    
    
}]);