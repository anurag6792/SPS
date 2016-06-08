app.controller('ProviderCtrl',['$scope','userAuth','$ionicModal','$stateParams','$ionicLoading','$ionicPopup','$ionicHistory','$state', function($scope,userAuth,$ionicModal,$stateParams,$ionicLoading,$ionicPopup,$ionicHistory,$state){
    
    //show loading
    $scope.show = function() {
                    $ionicLoading.show({
                      template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                  };
    //hide loading
    $scope.hide = function(){
                     $ionicLoading.hide();
                  };
    
    // View FeedBack Modal    
     $ionicModal.fromTemplateUrl('templates/feedbackmodal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });

      $scope.openfeedbackmodal = function(){
         $scope.modal.show();
      };

      $scope.closefeedbackmodal = function() {
        $scope.modal.hide();
      };
    
    
    $scope.jobresid = $stateParams.JobResponseId;//adding jobresponseid in jobresid
    
    
    //function to view job estimate details by a particular provider by passing job response id
    var viewjobestimatedetails = userAuth.viewsinglejobestimatedetail($scope.jobresid);
    $scope.show();
    viewjobestimatedetails.then(function (response) {
            if (response.success == "true") {
                $scope.hide();
                $scope.jobestimateDetails = response.description;//adding job estimate details in jobestimateDetails
                console.log('In ProviderCtrl : view job estimate details successful');
                }
            else if(response.success == "false") {
                $scope.hide(); 
                console.log('In ProviderCtrl : view job estimate details unsuccessful'); 
                }
            else {
                $scope.hide(); 
                console.log('In ProviderCtrl : view job estimate details unsuccessful');  
                 }
    });
    
    
    $scope.allfeedbacks = [];//storing feedback details
    $scope.firstnames = [];//storing firstnames
    $scope.lastnames = [];//storing lastnames
    
    //function to view feedbacks
    $scope.viewfeedbacks =  function(){
        var feedbacks = userAuth.feedbacks($scope.jobestimateDetails.ServiceProviderID);
        feedbacks.then(function (response) {
            if (response.success == "true") {
                console.log('In ProviderCtrl : view feedbacks was successful');
                console.log(response);
                $scope.allfeedbacks =response;
               
                for(var i=0;i<$scope.allfeedbacks.description.length;i++){
                    var getusername =  userAuth.userDetails($scope.allfeedbacks.description[i].FeedbackBy);
                    getusername.then(function (data) {
                       
                         if (data.success == "true") {
                          $scope.firstnames [i] = data.description.FirstName ;  
                          $scope.lastnames [i] = data.description.LastName ;  
                         }
                        else{

                        }

                    });
                };
                $scope.openfeedbackmodal();
                
            }
             else if(response.success == "false") {
                console.log('In ProviderCtrl : view feedbacks was not successful'); 
                console.log(response);
                $scope.feedbackAlert(); 
             }
         
        });
    };
    
    //function to show if the provider has no feedbacks
    $scope.feedbackAlert = function() {
       var alertPopup = $ionicPopup.alert({
             title: 'Feedback',
             template: 'Sorry,there were no feedbacks for this service provider',
             okText:'OK',
             okType:'button button-block login-button',
             onTap: function(e){
                return true;
             }   
           });

           alertPopup.then(function(res) {
             console.log('Feedback alert shown successfully');
           });
    };
    
    //function to ask customer if he wants to confirm the service provider
    $scope.confirmestimate = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Accept Estimate',
         template: 'Are you sure you want accept this provider?',
         cancelText: 'Decline', // String (default: 'Cancel'). The text of the Cancel button.
         okText: 'Accept', // String (default: 'OK'). The text of the OK button.
         okType: 'button login-button', // String (default: 'button-positive'). The type of the OK button.   
       });

       confirmPopup.then(function(res) {
         if(res) {
           $scope.acceptestimate();     
           console.log('You are sure');
         } else {
           $scope.goBack();     
           console.log('You are not sure');
         }
       });
     };
    
    
    //Function to accept the estimate of the particular service provider
    $scope.acceptestimate = function(){
        var acceptjobestimate = userAuth.acceptestimate($scope.jobestimateDetails.JobResponseId,$scope.jobestimateDetails.JobId);
        $scope.show();
        acceptjobestimate.then(function (response) {
            if (response.success == "true") {
                $scope.hide();
                $scope.acceptestimatesuccessful();
                console.log('In ProviderCtrl : accept job estimate successful');
                
                }
             else if(response.success == "false") {
                $scope.hide(); 
                $scope.acceptestimatefailed(); 
                console.log('In ProviderCtrl : accept job estimate unsuccessful'); 
                }
             else {
                $scope.hide(); 
                $scope.acceptestimatefailed();  
                console.log('In ProviderCtrl : accept job estimate unsuccessful');  
                 
             }
         
        });
        
    };
    
    //Alert function showing that the customer has accepted the service provider
    $scope.acceptestimatesuccessful = function() {
       var alertPopup = $ionicPopup.alert({
             title: 'Estimate',
             template: 'You have accepted the estimate from this provider.We will let you know when he will reach to your house,thanks',
             okText:'OK',
             okType:'button button-block login-button',
             onTap: function(e){
                return true;
             }   
           });

           alertPopup.then(function(res) {
               $state.go('app.estimates', {}, { reload: true });
             console.log('Estimate has been sent successfully');
           });
         };
    
    //Alert function showing that the customer has not accepted the service provider due to some errors
    $scope.acceptestimatefailed = function() {
       var alertPopup = $ionicPopup.alert({
             title: 'Estimate',
             template: 'Due to some error you cannot accept.Sorry for the inconvenience faced. Please try again after some times.',
             okText:'OK',
             okType:'button button-block login-button',
             onTap: function(e){
                return true;
             }   
           });

           alertPopup.then(function(res) {
             console.log('Estimate has not been sent successfully');
           });
         };
    
    //Function to go back to previous view or when the customer cancels the service provider estimate
    $scope.goBack = function() {
        console.log('goback');
	      $ionicHistory.goBack();
	       
        };
    
}]);