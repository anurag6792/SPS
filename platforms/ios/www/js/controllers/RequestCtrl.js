app.controller('RequestCtrl',['$scope','userAuth','localStorageService','$filter','$ionicLoading',function($scope,userAuth,localStorageService,$filter,$ionicLoading){
    
    $scope.show = function() {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                  };
    
    $scope.hide = function(){
                     $ionicLoading.hide();
                  };
    
    
    
    
    $scope.userID = localStorageService.get('userID');//adding consumer userID in userID in RequestCtrl
    console.log('Added consumer userID  to the RequestCtrl in userID ') ;
    
    $scope.jobrequests = [];
    var viewjobrequests = userAuth.viewjobrequests($scope.userID);
    $scope.show();
    viewjobrequests.then(function (response) {
            if (response.success == "true") {
                $scope.hide();
                $scope.showRequest = JSON.parse(response.success);
                $scope.jobrequests = response.description;
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