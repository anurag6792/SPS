app.controller('ViewrequestCtrl',['$scope','$stateParams','localStorageService','userAuth',function($scope,$stateParams,localStorageService,userAuth){
    
    $scope.requestID = {};
    $scope.requestID = localStorageService.get('jobrequests');//adding consumer job requests in requestID in ViewrequestCtrl
    console.log('Added consumer job requests  to the ViewrequestCtrl in requestID ') ;
    $scope.jobid = $stateParams.jobID;
    $scope.jobrequestDetails = {};
    console.log($scope.requestID );
    for(var i = 0; i < $scope.requestID.description.length;i++){
        if($scope.requestID.description[i].JobId == $scope.jobid ){
            $scope.jobrequestDetails = $scope.requestID.description[i];
            console.log($scope.jobrequestDetails );
        }
    }
    
    
}]);