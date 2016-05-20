app.service("userAuth",['$q','$http','localStorageService','$filter',function($q,$http,localStorageService,$filter){
    var logged = false;
    
    // Login API 
    function login(username, password) {
        console.log("In service login function");
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
                    console.log("Login API successfully called");
                    localStorageService.set('userprofile',response);//setting the response from login into "userprofile"
                    console.log(response);    
                    deferredObject.resolve(response);
                    localStorageService.set('logged',JSON.parse(response.success));//setting the "logged" true 
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    // Logout function to destroy user credentials 
    function destroyUser(){
//        profile2 = {};
//        userprofile = {};
        localStorageService.set('userprofile',null);
        localStorageService.set('logged',false);
        localStorageService.set('requestDetails',null);
    }
    
    // Function to check whether user is logged in or not
    function isLoggedIn(){
        return localStorageService.get('logged');
    }
    
    // Function to send job request to the operator/admin
    function sendRequest(subject,postedby,status,details,date,image,recstatus,by){
        console.log(subject);
        console.log(postedby);
        console.log(status);
        console.log(details);
        console.log(date);
        console.log(image);
        console.log(recstatus);
        console.log(by);
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/Job/SaveJobRequest',
                method : 'POST',
                data   : {  "JobName": subject,
                            "PostedBy": postedby,
                            "JobStatus": status,
                            "JobDetails": details,
                            "CustomerExpectedDate": date,
                            "ImageUrl": image,
                            "RecordStatus": recstatus},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    deferredObject.resolve(response);
                    console.log(response);
                    localStorageService.set('requestDetails',response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
        
    }
    
    //Function to register new user
    function newuser(registerUser) {
        console.log("In service newuser function");
        var newuserDOB = $filter('date')(registerUser.date, 'yyyy/MM/dd'); // converting DOB of new user in this format(yyyy/MM/dd)
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/user/adduser',
                method : 'POST',
                data   : {  "Username": registerUser.mobile,
                            "Emailid": registerUser.email,
                            "FirstName": registerUser.firstname,
                            "MiddleName": registerUser.middlename,
                            "LastName": registerUser.lastname,
                            "Gender": registerUser.gender,
                            "DateOfBirth": newuserDOB,
                            "Contact": registerUser.mobile,
                            "RoleId": "3",
                            "IsVerified": "No",
                            "IsFirstTimeLogin": "Yes",
                            "RecordStatus": "0"
                         },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("New User API successfully called");
                    console.log(response);    
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    return {
        login: login,//login function where the login API is called
        destroyUser : destroyUser,// function to destroy userdetails stored in loacal storage
        isLoggedIn : isLoggedIn,//function to check whether the user is logged in or not
        sendRequest : sendRequest,
        newuser : newuser
        
        
    };
    
}]);