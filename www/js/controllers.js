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
    var ref = new Firebase("https://chatoi.firebaseio.com/chats/"+$scope.createrId+"/"+window.localStorage['userId']);
    $scope.messages = $firebaseArray(ref);


    $scope.sendMessage = function() {
      var ref1 = new Firebase("https://chatoi.firebaseio.com/chats/"+$scope.createrId+"/"+window.localStorage['userId']);
      $scope.messages1= $firebaseArray(ref1);
      $scope.messages1.$add({ body: $scope.messageContent});
      var ref2 = new Firebase("https://chatoi.firebaseio.com/chats/"+$scope.createrId+"/"+$scope.createrId);
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
  .controller('MessagesCtrl', function($scope,$state,SubjectService) {
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
  });

