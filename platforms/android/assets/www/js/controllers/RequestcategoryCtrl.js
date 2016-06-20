app.controller('RequestcategoryCtrl',['$scope',
                                      'localStorageService',
                                      '$ionicLoading',
                                      'userAuth',
                                      '$state',function($scope,localStorageService,$ionicLoading,userAuth,$state){
    
    
    $scope.user = {};// creating a user object to show the details of the user in the dashboard page    
    $scope.userId =  localStorageService.get('userID'); // storing the user Id to get the user details
    
    // Function to Show the loader    
    $scope.show = function() {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                  };
    // Function to Hide the loader    
    $scope.hide = function(){
                     $ionicLoading.hide();
                  }; 
        
    // Function to get user details and storing it in user   
    var getuserdetails = userAuth.userDetails($scope.userId);
    $scope.show();    
    getuserdetails.then(function(response){
        if (response.success == "true") {
            $scope.hide();
            $scope.user = response;
            console.log('Added consumer details to the DashboardCtrl in user') ;
        }
        else{
            $scope.hide();
            userAuth.destroyUser();
            $state.go('login');
        }
    });
    
    $scope.addrequest = function(){
        $state.go('app.dashboard');
    };                                      
}]);