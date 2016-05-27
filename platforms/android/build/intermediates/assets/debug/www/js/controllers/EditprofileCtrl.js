app.controller('EditprofileCtrl',['$scope','userAuth','$state','localStorageService','$filter','$ionicPopup',function($scope,userAuth,$state,localStorageService,$filter,$ionicPopup){
    $scope.profile = {};
    $scope.edituser = {};
    $scope.userId =  localStorageService.get('userID');     
    var getuserdetails = userAuth.userDetails($scope.userId);    
    getuserdetails.then(function(response){
        if (response.success == "true") {
             $scope.profile = response;
             $scope.edituser.firstname = $scope.profile.description.FirstName;
             $scope.edituser.lastname = $scope.profile.description.LastName;
             $scope.edituser.middlename = $scope.profile.description.MiddleName;
             $scope.edituser.email = $scope.profile.description.EmailId;
             $scope.edituser.mobile = $scope.profile.description.Contact;
             $scope.edituser.gender = $scope.profile.description.Gender;
             $scope.edituser.dob = $filter('date')($scope.profile.description.DateOfBirth, 'yyyy-MM-dd');
             console.log('Added consumer details to the ProfileCtrl in profile') 
        }
        else{
            userAuth.destroyUser();
            $state.go('login');
        }
    });
    //$scope.edituser.firstname = '';
   $scope.saveuser = function(saveuser){
        console.log(saveuser);
        var edituserdetails = userAuth.edituserDetails($scope.edituser,$scope.profile);
        edituserdetails.then(function(response){
            if(response.success == 'true'){
                $scope.successEdited();            
            }
            else{
                $scope.failedEdited();   
            }
        });
    };    
    
    //Alert when user profile successfully edited
    $scope.successEdited = function() {
                   var alertPopup = $ionicPopup.alert({
                     title: 'Request',
                     template: 'Your profile has been successfully edited',
                     okText:'OK',
                     okType:'button button-block login-button',
                     onTap: function(){
                       return true;
                     }   
                   });

                   alertPopup.then(function(res) {
                     if(res){
                         $state.go('app.profile'); 
                     }  
                     console.log('profile editing was successful')
                   });
                 };
    
    //Alert when user profile could not edited
    $scope.failedEdited = function() {
                   var alertPopup = $ionicPopup.alert({
                     title: 'Request',
                     template: 'Your profile coud not be edited du to some error',
                     okText:'OK',
                     okType:'button button-block login-button',
                     onTap: function(e){
                         return true;
                     }   
                   });

                   alertPopup.then(function(res) {
                     if(res){
                         $state.go('app.profile'); 
                     } 
                     console.log('profile editing was unsuccessful');
                   });
                 };   
}]);