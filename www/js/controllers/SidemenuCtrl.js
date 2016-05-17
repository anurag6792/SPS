app.controller('SidemenuCtrl',['$scope','$state','userAuth',function($scope,$state,userAuth){
    $scope.userdetails = userAuth.getInfo(function(data){
        return data;
    });
    console.log('userdetails');
    console.log($scope.userdetails);
    $scope.logout = function(){
        userAuth.destroyUser();
        $state.go('login');
    };
}]);