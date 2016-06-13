app.controller('SignupCtrl',[
    '$scope',
    'userAuth',
    '$state',
    '$ionicPopup',
    '$cordovaCamera',
    '$ionicLoading',
    function($scope,userAuth,$state,$ionicPopup,$cordovaCamera,$ionicLoading){
    $scope.newuser = [];
     // Function to Show the loader    
    $scope.show = function() {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                  };
    // Function to Hide the loader    
    $scope.hide = function(){
                     $ionicLoading.hide();
                  };     
    $scope.uploadimage = function(){
        console.log('upload image');
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
          };
        
          $cordovaCamera.getPicture(options).then(function(imageData) {
//            var image = document.getElementById('myImage');
            $scope.newuser.userimage = "data:image/jpeg;base64," + imageData;
              alert($scope.newuser.userimage);
          }, function(err) {
            // error
          });
    };    

    $scope.registerUser = function(registerUser){
       console.log(registerUser);  
       console.log('signed up');  
       var newreguser = userAuth.newuser(registerUser);// passing new users details to newuser func. in service
        $scope.show();    
       newreguser.then(function(response){
           if(response.success == 'true'){
               $scope.hide();
               $scope.newuserSuccess();//showing alert when new user is successfully added
           }
           else{
               $scope.hide();
               $scope.newuserFailed();//showing alert when new user is not successfully added
           }
       });  
     };
    //Function showing alert when when new user is successfully added  
    $scope.newuserSuccess =function() {
                   var alertPopup = $ionicPopup.alert({
                     title: 'SignUp',
                     template: 'You have been added.Please check Your email for more info.',
                     okText:'OK',
                     okType:'button button-block login-button',
                     onTap: function(){
                       return true;
                     }   
                   });

                   alertPopup.then(function(res) {
                     if(res){
                         $state.go('login'); 
                     }  
                     console.log('New User has been successfully added')
                   });
                 };
    //Function showing alert when new user is not successfully added        
    $scope.newuserFailed =function() {
                   var alertPopup = $ionicPopup.alert({
                     title: 'SignUp',
                     template: 'Sorry there were some error.Please try again after some times',
                     okText:'OK',
                     okType:'button button-block login-button',
                     onTap: function(){
                       return true;
                     }   
                   });

                   alertPopup.then(function(res) {
                     if(res){
                         $state.go('login'); 
                     }  
                     console.log('New User has not been added due to some error')
                   });
                 };    

}]);