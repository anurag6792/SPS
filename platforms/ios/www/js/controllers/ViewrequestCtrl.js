app.controller('ViewrequestCtrl',['$scope','$stateParams','localStorageService','userAuth','$ionicLoading',function($scope,$stateParams,localStorageService,userAuth,$ionicLoading){
    
    $scope.requestID = {};
    $scope.requestID = localStorageService.get('jobrequests');//adding consumer job requests in requestID in ViewrequestCtrl
    $scope.jobid = $stateParams.jobID;
    $scope.jobrequestDetails = {};
    $scope.addressDetails = {};
    $scope.show = function() {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                  };
    
    $scope.hide = function(){
                     $ionicLoading.hide();
                  };
    var viewjobrequest = userAuth.viewsinglejobrequest($scope.jobid);
    
    $scope.show();
    viewjobrequest.then(function (response) {
            if (response.success == "true") {
                $scope.hide();
                $scope.jobrequestDetails = response.description;
                $scope.addressDetails =  response.description.UserAddress;
                
                console.log('In RequestCtrl : view requests successful');
                
                }
             else if(response.success == "false") {
                $scope.hide(); 
                console.log('In RequestCtrl : view requests unsuccessful'); 
                }
             else {
                $scope.hide(); 
                console.log('In RequestCtrl : view requests unsuccessful');  
                 
             }
         
        });
    
  
    
}]);