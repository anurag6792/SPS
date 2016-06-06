app.controller('EstimatesCtrl',['$scope','userAuth','localStorageService','$filter','$ionicLoading',function($scope,userAuth,localStorageService,$filter,$ionicLoading){
    
    $scope.show = function() {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                  };
    
    $scope.hide = function(){
                     $ionicLoading.hide();
                  };
    
    $scope.userID = localStorageService.get('userID');//adding consumer userID in userID in RequestCtrl
    console.log('Added consumer userID  to the EstimatesCtrl in userID ') ;
    
    
    $scope.jobestimates = [];
    var viewjobestimates = userAuth.viewjobestimates($scope.userID);
    $scope.show();
    viewjobestimates.then(function (response) {
            if (response.success == "true") {
                $scope.hide();
                $scope.showEstimates = response.success ;
                $scope.jobestimates = response.description;
                console.log('In EstimatesCtrl : view estimates successful');
                
                }
             else if(response.success == "false") {
                $scope.showRequest = response.success ; 
                $scope.hide(); 
                console.log('In EstimatesCtrl : view estimates unsuccessful'); 
                }
             else {
                $scope.showRequest = false ; 
                $scope.hide(); 
                console.log('In EstimatesCtrl : view estimates unsuccessful');  
                 
             }
         
        });
    
}]);