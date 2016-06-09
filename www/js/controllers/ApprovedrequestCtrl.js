app.controller('ApprovedrequestCtrl',['$scope','userAuth','localStorageService','$filter','$ionicLoading',function($scope,userAuth,localStorageService,$filter,$ionicLoading){
    
    $scope.show = function() {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                  };
    
    $scope.hide = function(){
                     $ionicLoading.hide();
                  };
    
    $scope.userID = localStorageService.get('userID');//adding consumer userID in userID in RequestCtrl
    console.log('Added consumer userID  to the ApprovedrequestCtrl in userID ') ;
    
    $scope.approvedrequests = [];
    var viewapprovedrequests = userAuth.viewapprovedjobrequests($scope.userID);
    $scope.show();
    viewapprovedrequests.then(function (response) {
            if (response.success == "true") {
                $scope.hide();
                console.log(response);
                $scope.showRequest = JSON.parse(response.success);
                $scope.approvedrequests = response.description;
                console.log('In RequestCtrl : view requests successful');
                
                }
             else if(response.success == "false") {
                $scope.showRequest = JSON.parse(response.success); 
                $scope.hide(); 
                console.log('In RequestCtrl : view requests unsuccessful'); 
                }
             else {
                $scope.showRequest = false ; 
                $scope.hide(); 
                console.log('In RequestCtrl : view requests unsuccessful');  
                 
             }
         
        });
    
}]);