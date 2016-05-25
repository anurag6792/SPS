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
    '$cordovaGeolocation',
    '$ionicPlatform',
    '$http',
    '$ionicModal',
    function( $scope, userAuth, localStorageService, $cordovaCamera, $cordovaFile,$filter,$ionicPopup,$state,$ionicLoading,$cordovaGeolocation,$ionicPlatform,$http,$ionicModal){
    $scope.request= {};    
    $ionicModal.fromTemplateUrl('templates/addressmodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });

      $scope.openMyModal = function(arr,rrr)
      {
         $scope.request.address1 = arr[arr.length-4];
         $scope.request.address2 = arr[arr.length-3];
         $scope.request.city = arr[arr.length-3];
         $scope.request.state = rrr[rrr.length - 2];
         $scope.request.postal = rrr[rrr.length - 1];
         $scope.request.country = arr[arr.length-1];  
         $scope.modal.show();
      };

      $scope.closeModal = function() {
        $scope.modal.hide();
      }; 
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
        
    $scope.addAddress = function(){
        
        
    };
    $scope.GPSerror = function() {
                   var alertPopup = $ionicPopup.alert({
                     title: 'Error',
                     template: 'Could not get your Location </br> Please enable your GPS',
                     okText:'OK',
                     okType:'button button-block login-button',
                     onTap: function(){
                       return true;
                     }   
                   });

                   alertPopup.then(function(res) {
                     if(res){
                         $state.go('app.dashboard'); 
                     }  
                     console.log('enable GPS error message was prompted')
                   });
                 };    
        
    $ionicPlatform.ready(function() {
        
        $scope.usecurrentLocation = function (){
 
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });
         
        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
 
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
            console.log(lat); 
            console.log(long); 
            $ionicLoading.hide();           
            
            
            $http({
                      method: 'GET',
                      url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&sensor=true'
                    }).then(function successCallback(response) {
                            console.log(response);
                            var address=response.data.results[0].formatted_address;
                            var addressarray = address.split(',');
                            var statearray = addressarray[addressarray.length-2].split(' ');
                            $scope.openMyModal(addressarray,statearray);
                           
                            
                        // this callback will be called asynchronously
                        // when the response is available
                      }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.GPSerror();
                        
                      });           
            
            }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            });
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