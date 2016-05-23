app.controller('DashboardCtrl',[
    '$scope',
    'userAuth',
    'localStorageService',
    '$cordovaCamera',
    '$cordovaFile',
    '$filter',
    '$ionicPopup',
    '$state',
    '$ionicLoading',
    function( $scope, userAuth, localStorageService, $cordovaCamera, $cordovaFile,$filter,$ionicPopup,$state,$ionicLoading){
    $scope.date = new Date();
    $scope.user = {};    
    $scope.userId =  localStorageService.get('userID'); 
    $scope.show = function() {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                  };
  
    $scope.hide = function(){
                     $ionicLoading.hide();
                  };     
    var getuserdetails = userAuth.userDetails($scope.userId);
    $scope.show();    
    getuserdetails.then(function(response){
        if (response.success == "true") {
            $scope.hide();
            $scope.user = response;
            console.log('Added consumer details to the DashboardCtrl in user') ;
        }
        else{
            $scope.hide();
            userAuth.destroyUser();
            $state.go('login');
        }
    });
          
    //$scope.user = localStorageService.get('userprofile');//adding consumer details in user in DashboardCtrl
    //console.log('Added consumer details to the DashboardCtrl in user') ;
    $scope.requestdetails = {};    
    $scope.images = []; //array where images taken by the consumer will be stored
    $scope.sendRequest = function(request){ // function will be called when consumer sends the details of the request
        
        $scope.expectedDate = $filter('date')(request.Date, 'yyyy/MM/dd'); // converting expected date from consumer to this                                                                                        format(yyyy/MM/dd)
        console.log(request);
        
        // sending request from the DashboardCtrl
        var sendrequest = userAuth.sendRequest(request.subject,$scope.user.description.UserId,0,request.detail,$scope.expectedDate,$scope.images,0,$scope.user.description.UserId);//passing request parameters along with some user details
        
        sendrequest.then(function (response) {
            if (response.success == "true") {
                console.log('In DashboardCtrl : request sending successful');
                 $scope.successRequest();// alerting when the request has been sent successfully
                $scope.requestdetails = localStorageService.get('requestDetails');//adding request details in requestdetails inDashboardCtrl
                console.log('Added request details to the DashboardCtrl in requestdetails') ;
            }
             else if(response.success == "false") {
                console.log('In DashboardCtrl : request sending unsuccessful'); 
                $scope.failedRequest(); // alerting when the request has not been sent successfully
                
               
             }
         
        });
    };
    
    //function to take picture from the consumers mobile
    $scope.takePicture = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.images.push($scope.imgURI);
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }
    
    //Alert when Request sent successfully
    $scope.successRequest = function() {
                   var alertPopup = $ionicPopup.alert({
                     title: 'Request',
                     template: 'The request has been successfully sent',
                     okText:'OK',
                     okType:'button button-block login-button',
                     onTap: function(){
                       return true;
                     }   
                   });

                   alertPopup.then(function(res) {
                     if(res){
                         $state.reload(); 
                     }  
                     console.log('reloaded the page after the request has been successfully sent')
                   });
                 };
    //Alert when Request sent unsuccessfully    
    $scope.failedRequest = function() {
                   var alertPopup = $ionicPopup.alert({
                     title: 'Request',
                     template: 'The request was not sent',
                     okText:'OK',
                     okType:'button button-block login-button',
                     onTap: function(e){
                         return true;
                     }   
                   });

                   alertPopup.then(function(res) {
                     if(res){
                         $state.reload(); 
                     } 
                     console.log('reloaded the page after the request has not been successfully sent');
                   });
                 };   
    
}]);