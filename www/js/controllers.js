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
  .controller('ChatCtrl', function($scope,$state, Pubnub,$firebaseArray) {
    $scope.createrId = $state.params.createrId;
    var ref = new Firebase("https://chatoi.firebaseio.com/chats/"+$scope.createrId+"/"+window.localStorage['userId']+"/messages");
    $scope.messages = $firebaseArray(ref);


    $scope.sendMessage = function() {
      var ref1 = new Firebase("https://chatoi.firebaseio.com/chats/"+$scope.createrId+"/"+window.localStorage['userId']+"/messages");
      $scope.messages1= $firebaseArray(ref1);
      $scope.messages1.$add({ body: $scope.messageContent});
      var ref2 = new Firebase("https://chatoi.firebaseio.com/chats/"+$scope.createrId+"/"+$scope.createrId+"/messages");
      $scope.messages2= $firebaseArray(ref2);
      $scope.messages2.$add({ body: $scope.messageContent});
    }




  })
  .controller('LoginCtrl', function($scope,$state,$ionicPlatform,UserService) {
    $ionicPlatform.ready(function () {
      var uuid= window.localStorage['userId'];
      if(uuid&&uuid !='undefined'){
        $scope.uuid=uuid;
        $state.go("subjects");
      }
    });
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

      $state.go("subjects");
    }
  })
  .controller('SubjectsCtrl', function($scope,$state,SubjectService) {
    var uuid=angular.fromJson(window.localStorage['uuid']);

    $scope.subjects=[];
    SubjectService.GetSubjects()
      .then(function (subjects) {
        angular.copy(subjects,$scope.subjects);
      }, function (err) {
      });
    $scope.createSubject = function(){
      var subject = {
        title : $scope.title,
        user : window.localStorage['userId']
      }
      SubjectService.CreateSubject(subject)
        .then(function () {

        }, function (err) {
        });

    }
  })
  .controller('MessagesCtrl', function($scope,$firebaseArray) {
    var ref = new Firebase("https://chatoi.firebaseio.com/chats/"+window.localStorage['userId']);
    ref.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // key will be "fred" the first time and "barney" the second time
        var key = childSnapshot.key();
        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
      });
      console.log(snapshot.key() + " was " + snapshot.val().height + " meters tall");
    });

    $scope.messages = $firebaseArray(ref);
    $scope.ss = function(id){
      var ref = new Firebase("https://chatoi.firebaseio.com/chats/"+window.localStorage['userId']);
      ref.orderByChild("height").on("child_added", function(snapshot) {
        var user=
        $scope.messages.push();
        console.log(snapshot.key() + " was " + snapshot.val().height + " meters tall");
      });
      console.log($scope.messages)
    }

  });

