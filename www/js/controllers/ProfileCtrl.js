app.controller('ProfileCtrl',[
    '$scope',
    'userAuth',
    'localStorageService',
    '$state',
    '$ionicModal',
    '$ionicPopup',
    '$ionicLoading',
    '$cordovaImagePicker',
    function($scope,userAuth,localStorageService,$state,$ionicModal,$ionicPopup,$ionicLoading,$cordovaImagePicker){
     $scope.password = {};//for storing password objects after changing password
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
    //Change Password Modal    
    $ionicModal.fromTemplateUrl('templates/changepasswordmodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
    $scope.openchangepasswordModal = function(){
        
        $scope.modal.show();
    };
    $scope.closechangepasswordModal = function() {
       $scope.modal.hide();
    };         
   
    $scope.profile = {};
   
    $scope.userId =  localStorageService.get('userID');     
    var getuserdetails = userAuth.userDetails($scope.userId);
    $scope.show();    
    getuserdetails.then(function(response){
        if (response.success == "true") {
            $scope.hide();
            $scope.profile = response;
            //console.log($scope.profile);
             console.log('Added consumer details to the ProfileCtrl in profile') 
        }
        else{
            $scope.hide();
            userAuth.destroyUser();
            $state.go('login');
        }
    });
    
    //function to open change password modal    
    $scope.changepassword = function(){
       $scope.openchangepasswordModal();   
    };
    
    //function to save user password    
    $scope.savepassword = function(password){
        var editpassword = userAuth.changeuserpassword($scope.userId,password);    
        editpassword.then(function(response){
            if (response.success == "true") {
                $scope.successPassword();
                console.log('changed password successfully'); 
            }
            else{
                $scope.failPassword();
                console.log('changed password was not successfully');
                
            }
        });
    };
        
    //Alert when Password change successfully
    $scope.successPassword = function() {
                   var alertPopup = $ionicPopup.alert({
                     title: 'Password Change',
                     template: 'Your Password was changed successfully',
                     okText:'OK',
                     okType:'button button-block login-button',
                     onTap: function(){
                       return true;
                     }   
                   });

                   alertPopup.then(function(res) {
                     if(res){
                         $scope.closechangepasswordModal();
                     }  
                     console.log('alert closed after successful password change');
                   });
                 };
    //Alert when Password change was  unsuccessful   
    $scope.failPassword = function() {
                   var alertPopup = $ionicPopup.alert({
                     title: 'Password Change',
                     template: 'Sorry, due to some error your password was not changed. Please tryagain after sometimes',
                     okText:'OK',
                     okType:'button button-block login-button',
                     onTap: function(e){
                         return true;
                     }   
                   });

                   alertPopup.then(function(res) {
                     if(res){
                         $scope.closechangepasswordModal();
                     } 
                     console.log('alert closed after unsuccessful password change');
                   });
                 };
        
        $scope.newimage = '';
        $scope.changeuserimage = function(){
            var options = {
               maximumImagesCount: 1,
               width: 800,
               height: 800,
               quality: 80
              };

              $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                  alert(results)
                  $scope.newimage  = encodeImageUri(results[1]) ;
                  function encodeImageUri(imageUri)
                    {
                         var c=document.createElement('canvas');
                         var ctx=c.getContext("2d");
                         var img=new Image();
                         img.onload = function(){
                           c.width=this.width;
                           c.height=this.height;
                           ctx.drawImage(img, 0,0);
                         };
                         img.src=imageUri;
                         var dataURL = c.toDataURL("image/jpeg");
                         return dataURL;
                    }
                  
                  alert($scope.newimage);
                  var editimage = userAuth.edituserimage($scope.newimage);    
                  editimage.then(function(response){
                        if (response.success == "true") {
                            $state.go('app.profile', {}, { reload: true });
                            console.log('changed image successfully'); 
                        }
                        else{
                            alert('image change unsuccessful');
                            console.log('image change was not successfully');

                        }
                    });
                  
                  
                }, function(error) {
                  // error getting photos
                });
        };
        
        
}]);