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
    
        
    $scope.request= {}; // request model to send job request  
    $scope.address = []; // address array to save the addresses of the user    
    $scope.request.AddressId = localStorageService.get('addressId'); // setting address id 
    $scope.request.lat ='' ; 
    $scope.request.long ='';
    $scope.showaddedaddress = false; // showing the address that is chosen, setting it to false
   
    // Get current user Modal    
    $ionicModal.fromTemplateUrl('templates/addressmodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal1 = modal;
        });

      $scope.opengetlocationModal = function(arr,rrr)
      {
         $scope.request.address1 = arr[arr.length-4];
         $scope.request.address2 = arr[arr.length-3];
         $scope.request.city = arr[arr.length-3];
         $scope.request.state = rrr[rrr.length - 2];
         $scope.request.postal = rrr[rrr.length - 1];
         $scope.request.country = arr[arr.length-1];  
         $scope.modal1.show();
      };

      $scope.closeModal = function() {
        $scope.modal1.hide();
      };
     
        
     // Add address Modal    
     $ionicModal.fromTemplateUrl('templates/addaddressmodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal2 = modal;
        });

      $scope.openaddaddressModal = function()
      {
         $scope.modal2.show();
      };

      $scope.closeaddaddressModal = function() {
        $scope.modal2.hide();
      };
    
        
    // Show address Modal    
    $ionicModal.fromTemplateUrl('templates/showaddressmodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal3 = modal;
        });

      $scope.openshowaddressModal = function()
      {
         $scope.modal3.show();
      };

      $scope.closeshowaddressModal = function() {
        $scope.request.AddressId = localStorageService.get('addressId');
         $scope.addressCheck = false;     
        $scope.modal3.hide();
      };     
    
     // Map Modal    
    $ionicModal.fromTemplateUrl('templates/mapmodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal4 = modal;
          
          //$scope.canvas = angular.element(document.getElementById("map"));
              
        });

      $scope.openmapModal = function()
      {   
           
         
          $scope.modal4.show();
         
      };

      $scope.closemapModal = function() {
        $scope.map = null;  
        $scope.modal4.hide();
      };     
    
        
        
    $scope.date = new Date();// date to set the min date for estimate date in job request
    
    $scope.user = {};// creating a user object to show the details of the user in the dashboard page    
    $scope.userId =  localStorageService.get('userID'); // storing the user Id to get the user details
    
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
        
    // Function to get user details and storing it in user   
    var getuserdetails = userAuth.userDetails($scope.userId);
    $scope.show();    
    getuserdetails.then(function(response){
        if (response.success == "true") {
            $scope.hide();
            $scope.user = response;
            $scope.lastlogin = $filter('date')($scope.user.description.LastLoginDate, 'yyyy-MM-ddTHH:mm:ss.sssZ');
            console.log('Added consumer details to the DashboardCtrl in user') ;
        }
        else{
            $scope.hide();
            userAuth.destroyUser();
            $state.go('login');
        }
    });
    
        
        
    //Function to show error when the GPS is not responding    
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
        
     
        
   
    //Function to get the current location
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
            $scope.request.lat = lat;
            $scope.request.long = long;
            //var jus = document.getElementById('map');
//            var map;
            $scope.init = function() {
                var myLatlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                console.log('entered map');
                var myOptions = {
                    zoom: 16,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById('map'), myOptions);
                    
                var marker = new google.maps.Marker({
                    draggable: true,
                    position: myLatlng,
                    map:map,
                    title: "Your location"
                });

                google.maps.event.addListener(marker, 'dragend', function (event) {


                    $scope.request.lat = event.latLng.lat();
                    $scope.request.long = event.latLng.lng();
                });
                
                $scope.map = map;
            }
            
            //google.maps.event.addDomListener(window, "load", $scope.init());
            $scope.openmapModal();    
             $scope.init();   
            
                  
            
            }, function(err) {
            $ionicLoading.hide();
            console.log(err);
            });
            }
    });
        
    $scope.sendAddress = function(){
        $scope.closemapModal();
        console.log('hey');
        $http({
                      method: 'GET',
                      url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+$scope.request.lat+','+$scope.request.long+'&sensor=true'
                    }).then(function successCallback(response) {
                            console.log(response);
                            var address=response.data.results[0].formatted_address;
                            var addressarray = address.split(',');
                            var statearray = addressarray[addressarray.length-2].split(' ');
                            $scope.opengetlocationModal(addressarray,statearray);
                           
                            
                        // this callback will be called asynchronously
                        // when the response is available
                      }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.GPSerror();
                        
                      });    
    };   
    
        
    // Function add address of the user when he does not have the address or he wants to add a new address    
    $scope.addingAddress =  function(request){
                    
                    //Function to send the latitude and longitude with the add address
                     $ionicPlatform.ready(function() {
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
//                            $ionicLoading.hide();
                            $scope.request.lat = lat;
                            $scope.request.long = long;
                            }, function(err) {
//                            $ionicLoading.hide();
                            console.log(err);
                            });
                              
                         
                     });
        
        
                     var addingaddress = userAuth.saveaddress( request , $scope.userId);
                     addingaddress.then(function(response){
                          if (response.success == "true") {
                              console.log(' Address Added Successfully');
                              console.log(response);
                              $scope.addselectedaddress(response.description.AddressId);
                              $scope.closeaddaddressModal();
                              
                          }
                          else{
                              console.log(response);
                              $scope.closeaddaddressModal();
                              console.log(' Address was not Added Successfully');
                          }
                      });
                    
                    
                    
                }; 
    
     // Function add address of the user when he chooses to add his current location    
    $scope.addingcurrentAddress =  function(request){
                     var addingcurrentaddress = userAuth.saveaddress( request , $scope.userId);
                     addingcurrentaddress.then(function(response){
                          if (response.success == "true") {
                              console.log('Current Address Added Successfully');
                              console.log(response);
                              $scope.addselectedaddress(response.description.AddressId);
                              $scope.closeModal();
                          }
                          else{
                              console.log(response);
                              $scope.closeModal();
                              console.log('Current Address was not Added Successfully');
                          }
                      });
                    
                    
                    
                };      
    
        
    //Function to add the address
    $scope.addAddress = function(){
         $scope.show();    
        var showaddress = userAuth.showaddress( $scope.userId);
        showaddress.then(function(response){
            console.log(response);
        if (response.success == "true") {
            $scope.hide();
            console.log('user address successfully shown') ;
            
            if(response.description.length){
                $scope.address = response.description;
                $scope.openshowaddressModal();
            }
            else{
                $scope.openaddaddressModal();
                
            }
        }
        else{
            $scope.hide();
            console.log('user address was not  successfully shown due to error') ;
            $scope.openaddaddressModal();
            }
    });
        
    };    
    
    //Function to check if any of the addresses is chosen, if yes hiding the add new address button    
    $scope.checkradio = function(){
        $scope.addressCheck = true;
        console.log($scope.addressCheck);
    };
        
    
    //Function to add the selected address to the dashboard page    
    $scope.addselectedaddress = function(value){
        $scope.showaddedaddress = true;
        console.log(value);
         var getaddress = userAuth.showaddress( $scope.userId);
         getaddress.then(function(response){
            if (response.success == "true") {
                
                console.log(response);
                for(var x=0; x < response.description.length; x++ ){
                    
                    if( value == response.description[x].AddressId ){
                        
                        $scope.request.AddressId = value;
                        $scope.request.address1 = response.description[x].AddressLine1;
                        $scope.request.address2 = response.description[x].AddressLine2;
                        $scope.request.city = response.description[x].City;
                        $scope.request.state = response.description[x].State;
                        $scope.request.postal = response.description[x].Zip;
                        $scope.request.country = response.description[x].Country;
                        
                    }
                    
                }
            }       
         });
        
    }; 
        
    $scope.requestdetails = {};    
    $scope.images = []; //array where images taken by the consumer will be stored
    $scope.sendRequest = function(request){ // function will be called when consumer sends the details of the request
        
        $scope.expectedDate = $filter('date')(request.Date, 'yyyy/MM/dd'); // converting expected date from consumer to this                                                                                        format(yyyy/MM/dd)
        console.log(request);
        
        // sending request from the DashboardCtrl
        var sendrequest = userAuth.sendRequest(request.subject,$scope.user.description.UserId,0,request.detail,$scope.expectedDate,$scope.images,0,$scope.user.description.UserId,request.AddressId);//passing request parameters along with some user details
        
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