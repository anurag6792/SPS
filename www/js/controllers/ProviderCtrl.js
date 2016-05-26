app.controller('ProviderCtrl',['$scope','userAuth','$ionicModal',function($scope,userAuth,$ionicModal){
    
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
    
    $scope.allfeedbacks = [];
    $scope.firstnames = [];
    $scope.lastnames = [];
    $scope.viewfeedbacks =  function( userId){
        var feedbacks = userAuth.feedbacks( userId);
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
             }
         
        });
    }
}]);