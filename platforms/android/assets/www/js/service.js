app.service("userAuth",['$q','$http','localStorageService',function($q,$http,localStorageService){
     var userprofile ={};
     var profile2 ={};
     var loggedIn = false;
    //Login Authentication    
     function login(username, password) {
        console.log("enter");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/User/LoginUser',
                method : 'POST',
                data   : {'UserName' : username , 'Password':password},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
//                    userprofile = response;
                    localStorageService.set('userprofile',response);
                    deferredObject.resolve(response);
                    console.log(response);
                    console.log(userprofile);
                    loggedIn = JSON.parse(response.success);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    function userInfo(user){
        var userprofile = user;
        console.log('userprofile');
        console.log(userprofile.description);
        
    };
    
    function getInfo(){
        return profile2 = localStorageService.get('userprofile');
    };
    
    
    function destroyUser(){
        localStorageService.set('userprofile',{ });
        loggedIn = false;
    }
    
    function isLoggedIn(){
        return loggedIn;
    }
    return {
        login: login,
        userInfo : userInfo,
        getInfo : getInfo,
        destroyUser : destroyUser,
        isLoggedIn : isLoggedIn
        
    };
    
}]);