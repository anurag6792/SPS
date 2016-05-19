app.controller('ProfileCtrl',['$scope','userAuth','localStorageService',function($scope,userAuth,localStorageService){
    $scope.profile = {};
    $scope.profile = localStorageService.get('userprofile');
    console.log('Added consumer details to the ProfileCtrl in profile') 
    
    
}]);