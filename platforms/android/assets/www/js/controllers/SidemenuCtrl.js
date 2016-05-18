app.controller('SidemenuCtrl',[
    '$scope',
    '$state',
    'localStorageService',
    'userAuth',
    function($scope ,$state ,localStorageService ,userAuth ){
        
    $scope.userdetails = {};
    $scope.userdetails = localStorageService.get('userprofile');
    console.log('Added Consumer details to the SidemenuCtrl in userdetails');
    $scope.logout = function(){
        userAuth.destroyUser()
        $state.go('login',{},{reload:true});
    };
}]);