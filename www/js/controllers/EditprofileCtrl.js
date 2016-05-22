app.controller('EditprofileCtrl',['$scope','userAuth','$state','localStorageService',function($scope,userAuth,$state,localStorageService){
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
             $scope.edituser.dob = $scope.profile.description.DateOfBirth;
             console.log(response);
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
            console.log(response);
        });
    };    
    
}]);