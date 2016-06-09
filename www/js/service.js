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
                    localStorageService.set('userID',response.description.UserId);//setting the response from login into "userID"
                    deferredObject.resolve(response);
                    localStorageService.set('logged',JSON.parse(response.success));//setting the "logged" true 
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
     // Function to send Device Token
    function sendToken(userId , token) {
        console.log("In service login function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/user/SaveDeviceDetails',
                method : 'POST',
                data   : {'UserId' : userId , 'DeviceId':token},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("DeviceId API successfully called");
                    deferredObject.resolve(response);
                    })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    //Function to get the user details
    function userDetails(userid) {
        console.log("In service user details function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/User/CustomerDetails',
                method : 'POST',
                params   : {'id' : userid  },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("User details API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                    console.log("User details API was unsuccessful");
                    deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    //Function to edit user details
    function edituserDetails(userdetails,userprofile) {
        console.log("In service edit user function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/User/UpdateUser',
                method : 'POST',
                data   : {    
                                "Contact": userdetails.mobile,
                                "DateOfBirth":userdetails.dob,
                                "EmailId": userdetails.email,
                                "FirstName": userdetails.firstname,
                                "MiddleName": userdetails.middlename,
                                "LastName": userdetails.lastname,
                                "Gender": userdetails.gender,
                                "UserId": userprofile.description.UserId,
                                "UserName":userdetails.mobile,
                                "Password":userdetails.newpassword,
                                "RoleId": 3,
                                "IsVerified":'true',
                                "RecordStatus":0,
                                "ModifiedBy": 3,
                                "IsFirstTimeLogin": "No"
                         },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("Edit User details API successfully called");
                    console.log(response);
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    // Function to check whether user is logged in or not
    function isLoggedIn(){
        console.log("In service login-check function");
        return localStorageService.get('logged');
    }
    
    // Function to send job request to the operator/admin
    function sendRequest(subject,postedby,status,details,date,image,recstatus,by,AddressId){
        
        console.log("In service send job request function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/Job/SaveJobRequest',
                method : 'POST',
                data   : {  "JobName": subject,
                            "PostedBy": postedby,
//                            "JobStatus": status,
                            "JobDetails": details,
                            "CustomerExpectedDate": date,
                            "ImageList": image,
                            "AddressId": AddressId,
                            "RecordStatus": recstatus,
                            "JobStatus": 1
                         },
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
     //Function to change user password
     function changeuserpassword(userid,password) {
        console.log("In service user change password function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/User/ChangePassword',
                method : 'POST',
                data   : {
                                "UserId": userid,
                                "OldPassword": password.oldpassword,
                                "NewPassword": password.newpassword
                            },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("user change password API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                    console.log("user change password API was unsuccessful");
                    deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    
    //Function to register new user
    function newuser(registerUser) {
        console.log("In service register newuser function");
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
                            "Password": registerUser.password,
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
    //Function to view all the job requests
    function viewjobrequests(userID) {
        console.log("In service viewjobrequests function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/Job/ShowCustomerAllJobRequests',
                method : 'POST',
                params   : {"customerId": userID},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("View All Job requests API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    //Function to view single job requests using jobid
    function viewsinglejobrequest(userID) {
        console.log("In service view single jobrequests function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/Job/ShowJobDetails',
                method : 'POST',
                params   : {"id": userID},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("View single Job requests API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    //Function to view all the job estimates
    function viewjobestimates(userID) {
        console.log("In service view all the job estimates function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/Job/showEstimatesSummaryForCustomer',
                method : 'POST',
                params   : {"custid": userID},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log(response);
                    console.log("View All Job estimates API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    //Function to view single job estimate using userId & jobid
    function viewsinglejobestimate(userID,jobID) {
        console.log("In service view single job estimate function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/Job/showJobEstimatesForCustomer',
                method : 'POST',
                params   : {"custid": userID , "jobid": jobID },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log(response);
                    console.log("View single Job estimate API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    //Function to view single job estimate Detail using jobresid
    function viewsinglejobestimatedetail(jobresID) {
        console.log("In service view single job estimate function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/Job/showEstimateDetailsForCustomer',
                method : 'POST',
                params   : {"jresid": jobresID},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log(response);
                    console.log("View single Job estimate Details API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    //Function to view single job estimate Detail using jobresid
    function acceptestimate(jobresID,jobid) {
        console.log("In service view single job estimate function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/Job/acceptJobEstimateByCustomer',
                method : 'POST',
                data   : {
                            "JobResponseId":jobresID,
                            "JobId": jobid,
                            "JobAccepted": true
                           },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log(response);
                    console.log("View single Job estimate Details API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    //Function to view all the Approved job requests
    function viewapprovedjobrequests(userID) {
        console.log("In service viewjobrequests function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888//api/Job/showApprovedJobsForCustomer',
                method : 'POST',
                params   : {"custid": userID},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("View All Job requests API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    
    //Function to add the address of the user while sending the job rquest
    function showaddress(userID){
        console.log("In service addaddress function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/User/ShowUserAddress',
                method : 'POST',
                params   : {"id": userID},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("show user address API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
     //Function to Save the address of the user while sending the job rquest
    function saveaddress(request , id){
        console.log("In service addaddress function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/User/SaveUserAddress',
                method : 'POST',
                data   : {  "UserId": id,
                            "AddressLine1": request.address1,
                            "AddressLine2": request.address2,
                            "City": request.city,
                            "State": request.state,
                            "Zip": request.postal,
                            "Country": request.country,
                            "Latitude": request.lat,
                            "Longitude": request.long,
                            "RecordStatus":0
                         },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("save user address API successfully called");
                    localStorageService.set('addressId',response.description.AddressId);
                    deferredObject.resolve(response);
                })
               .error(function(error){
                             deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    };
    
    //Function to view all the feedbacks of the provider
    function feedbacks(userID){
        console.log("In service addaddress function");
        var deferredObject = $q.defer();
        $http({
                url    : 'http://ecomdemo.cloudapp.net:8888/api/feedback/ShowAllSPFeedbacksToCustomer',
                method : 'POST',
                params   : {"id": userID},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
                }})
               .success(function(response){
                    console.log("show provider feedbacks API successfully called");
                    deferredObject.resolve(response);
                })
               .error(function(error){
                    console.log("show provider feedbacks API was not successfully called");
                    deferredObject.reject(response);
                });
        
        return deferredObject.promise;       
        
    }
    // Logout function to destroy user credentials 
    function destroyUser(){
        console.log("In service logout function");
        localStorageService.set('userID',null);
        localStorageService.set('logged',false);
        localStorageService.set('requestDetails',null);
        localStorageService.set('addressId',null);
        localStorageService.set('DeviceToken',null);
    }
   
    return {
        login: login,//login function where the login API is called
        sendToken : sendToken,//function to send device token
        userDetails : userDetails,//function to get user details
        edituserDetails : edituserDetails,//function to edit user details
        changeuserpassword : changeuserpassword, //function to change user password
        destroyUser : destroyUser,//function to destroy userdetails stored in loacal storage
        isLoggedIn : isLoggedIn,//function to check whether the user is logged in or not
        sendRequest : sendRequest,//function to send job request to the operator/admin
        newuser : newuser,//function to register new user
        viewjobrequests : viewjobrequests,//Function to view all the job requests
        viewsinglejobrequest : viewsinglejobrequest,//Function to view single the job requests
        viewjobestimates:viewjobestimates,//Functon to view all job estimates sent by the provider
        viewsinglejobestimate : viewsinglejobestimate,//Function to view single job estimate
        viewsinglejobestimatedetail : viewsinglejobestimatedetail, // Function to view single job estimate details
        viewapprovedjobrequests : viewapprovedjobrequests,//Function to view all the approved job requests
        acceptestimate : acceptestimate, //Function to accept estimate by the provider
        showaddress :showaddress,//Function to show the user address
        saveaddress : saveaddress,//function to save address while sending job request
        feedbacks : feedbacks//Function to view provider feedbacks
    };
    
}]);