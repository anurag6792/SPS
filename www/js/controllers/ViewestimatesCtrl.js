app.controller('ViewestimatesCtrl',['$scope','$stateParams','localStorageService','userAuth','$ionicLoading',function($scope,$stateParams,localStorageService,userAuth,$ionicLoading){
    $scope.custid = $stateParams.customerID;
    $scope.jname = $stateParams.jobname;
    $scope.jobid = $stateParams.jobID;
    $scope.jobestimateDetails = [];
    $scope.show = function() {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                  };
    
    $scope.hide = function(){
                     $ionicLoading.hide();
                  };
    var viewjobestimate = userAuth.viewsinglejobestimate($scope.custid,$scope.jobid);
    
    $scope.show();
    viewjobestimate.then(function (response) {
            if (response.success == "true") {
                $scope.hide();
                $scope.jobestimateDetails = response.description;
                console.log('In ViewestimatesCtrl : view job estimate successful');
                
                }
             else if(response.success == "false") {
                $scope.hide(); 
                console.log('In ViewestimatesCtrl : view job estimate unsuccessful'); 
                }
             else {
                $scope.hide(); 
                console.log('In ViewestimatesCtrl : view job estimate unsuccessful');  
                 
             }
         
        });
    
}]);