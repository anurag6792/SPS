app.controller('DashboardCtrl',['$scope','userAuth','localStorageService','$cordovaCamera','$cordovaFile',function($scope,userAuth,localStorageService,$cordovaCamera, $cordovaFile){
    $scope.user = {};
    $scope.user = userAuth.getInfo(function(data){
        return data;
    });
    console.log($scope.user);
    $scope.images = [];
 
    
    
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
    
    
}]);