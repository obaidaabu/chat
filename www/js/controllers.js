angular.module('controllers', [])
  .controller('Messages', function($scope, $timeout, $ionicScrollDelegate,Pubnub) {


    $scope.hideTime = true;

    var alternate,
      isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {
      alternate = !alternate;

      var d = new Date();
      d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

      $scope.messages.push({
        userId: alternate ? '12345' : '54321',
        text: $scope.data.message,
        time: d
      });

      delete $scope.data.message;
      $ionicScrollDelegate.scrollBottom(true);

    };


    $scope.inputUp = function() {
      if (isIOS) $scope.data.keyboardHeight = 216;
      $timeout(function() {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);

    };

    $scope.inputDown = function() {
      if (isIOS) $scope.data.keyboardHeight = 0;
      $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function() {
      // cordova.plugins.Keyboard.close();
    };


    $scope.data = {};
    $scope.myId = '12345';
    $scope.messages = [];

  })
  .controller('AppsCtrl', function($scope,$ionicHistory) {
    $scope.GoBack = function() {

      $ionicHistory.goBack();

    };


  })
  .controller('ChatCtrl', function($scope,$state,$firebaseArray) {
    $scope.createrId = $state.params.createrId;
    var ref = new Firebase("https://chatoi.firebaseio.com/chats/"+$scope.createrId+"/"+window.localStorage['userId']+"/messages");
    $scope.messages = $firebaseArray(ref);


    $scope.sendMessage = function() {
      var ref1 = new Firebase("https://chatoi.firebaseio.com/chats/"+$scope.createrId+"/"+window.localStorage['userId']+"/messages");
      var newMessageRef1 = ref1.push();
      newMessageRef1.set({ body: $scope.messageContent});

      var ref2 = new Firebase("https://chatoi.firebaseio.com/chats/"+window.localStorage['userId']+"/"+$scope.createrId+"/messages");
      var newMessageRef2 = ref2.push();
      newMessageRef2.set({ body: $scope.messageContent});
      newMessageRef2.setPriority(1000);
    }




  })

  .controller('LoginCtrl', function($scope,$state,$ionicPlatform,UserService) {

    $scope.userId ="";
    $scope.login = function(){
      var user = {
        userName:$scope.username,
        pass:$scope.pass
      }
      UserService.CreateUser(user)
        .then(function (user) {
          window.localStorage['userId'] = user._id;
        }, function (err) {
        });

      $state.go("tab.subjects");
    }
  })
  .controller('SubjectsCtrl', function($scope,$rootScope,$state,$ionicHistory,SubjectService,EntityService) {
    var uuid=angular.fromJson(window.localStorage['uuid']);

    $scope.subjects=[];
    SubjectService.GetSubjects()
      .then(function (subjects) {
        angular.copy(subjects,$scope.subjects);
      }, function (err) {
      });
    $scope.create = function(){
      var subject = {
        title : $rootScope.subjectTitle,
        user : window.localStorage['userId'],
        description: $rootScope.subjectDesc
      }
      SubjectService.CreateSubject(subject)
        .then(function () {

        }, function (err) {
        });
      $ionicHistory.goBack();
    }
    $scope.goToChat =function(subject){
      $state.go('chat',{createrId:subject.user._id})
    }
    $scope.deleteSubject =function(subject){
      SubjectService.DeleteSubjects(subject)
        .then(function () {
          EntityService.deleteFromArray($scope.subjects,subject);
        }, function (err) {
        });
    }
  })
  .controller('MessagesCtrl', function($scope,$firebaseArray) {
    var ref = new Firebase("https://chatoi.firebaseio.com/chats/"+window.localStorage['userId']);

    var list = $firebaseArray(ref)
    var unwatch = list.$watch(function() {

      list.$loaded()
        .then(function(x) {
          $scope.messages = [];
          angular.forEach(x, function(value, key) {

            var senderId = value.$id;
            var messagesArray = Object.getOwnPropertyNames(value.messages);
            var lastMessageKey = messagesArray[messagesArray.length-1];
            var lastMessage = value.messages[lastMessageKey].body;

            $scope.messages.push({senderId: senderId,lastMessage:lastMessage});

          }, x);
        })
        .catch(function(error) {
          console.log("Error:", error);
        });
    });




    $scope.ss = function(id){

      var ref = new Firebase("https://chatoi.firebaseio.com/chats/"+window.localStorage['userId']);
      ref.orderByChild("height").on("child_added", function(snapshot) {


        console.log(snapshot.key() + " was " + snapshot.val().height + " meters tall");
      });
      console.log($scope.messages)
    }

  });

