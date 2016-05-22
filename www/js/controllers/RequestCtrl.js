app.controller('RequestCtrl',['$scope','userAuth','localStorageService','$filter',function($scope,userAuth,localStorageService,$filter){
    
    $scope.clearSearch = function() {
    $scope.searchrequest = '';
    };
//    $scope.userID = {};
    $scope.userID = localStorageService.get('userID');//adding consumer userID in userID in RequestCtrl
    console.log('Added consumer userID  to the RequestCtrl in userID ') ;
    
    $scope.jobrequests = {};
    var viewjobrequests = userAuth.viewjobrequests($scope.userID);
    viewjobrequests.then(function (response) {
            if (response.success == "true") {
                $scope.jobrequests = response.description;
                console.log('In RequestCtrl : view requests successful');
                }
             else if(response.success == "false") {
                console.log('In RequestCtrl : view requests successful'); 
                }
         
        });
}]);