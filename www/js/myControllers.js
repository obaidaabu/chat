angular.module('controllers', [])
  .controller('TabsCtrl', function($scope, $ionicSideMenuDelegate) {

  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  }

})
  .controller('addSubjectsCtrl', function ($scope, $rootScope, $state, $ionicHistory, SubjectService, EntityService) {
    $scope.create = function () {
      var subject = {
        title: $rootScope.subjectTitle,
        user: window.localStorage['userId'],
        description: $rootScope.subjectDesc
      }
      SubjectService.CreateSubject(subject)
        .then(function () {
          $state.go("tab.subjects");
        }, function (err) {
        });
    }
    $scope.GoBack = function () {
     // $state.go("tab.subjects");
      $ionicHistory.goBack();
    }

  })
  .controller('ChatCtrl', function ($scope, $state, $firebaseArray) {
    $scope.createrId = $state.params.createrId;
    var ref = new Firebase("https://chataaa.firebaseio.com/chats/" + $scope.createrId + "/" + window.localStorage['userId'] + "/messages");
    $scope.messages = $firebaseArray(ref);
    $scope.sendMessage = function () {
      var ref1 = new Firebase("https://chataaa.firebaseio.com/chats/" + $scope.createrId + "/" + window.localStorage['userId'] + "/messages");
      var newMessageRef1 = ref1.push();
      newMessageRef1.set({body: $scope.messageContent});
      var ref2 = new Firebase("https://chataaa.firebaseio.com/chats/" + window.localStorage['userId'] + "/" + $scope.createrId + "/messages");
      var newMessageRef2 = ref2.push();
      newMessageRef2.set({body: $scope.messageContent});
      newMessageRef2.setPriority(1000);
    }

  })

  .controller('LoginCtrl', function ($scope, $state, $ionicPlatform, UserService) {
    $scope.userId = "";
    $scope.login = function () {
      var user = {
        userName: $scope.username,
        pass: $scope.pass
      }
      UserService.CreateUser(user)
        .then(function (user) {
          window.localStorage['userId'] = user._id;
        }, function (err) {
        });

      $state.go("tab.subjects");
    }
  })
  .controller('SubjectsCtrl', function ($scope, $rootScope, $state, $ionicHistory, SubjectService, EntityService) {
    var uuid = angular.fromJson(window.localStorage['uuid']);
    var userId = window.localStorage['userId']
    $scope.subjects = [];
    SubjectService.GetSubjects(userId)
      .then(function (subjects) {
        angular.copy(subjects, $scope.subjects);
      }, function (err) {
      });

    $scope.goToChat = function (subject) {
      $state.go('chat', {createrId: subject.user._id})
    }
    $scope.deleteSubject = function (subject) {
      SubjectService.DeleteSubjects(subject)
        .then(function () {
          EntityService.deleteFromArray($scope.subjects, subject);
        }, function (err) {
        });
    }
  })
  .controller('MessagesCtrl', function ($scope, $firebaseArray, $state) {
    var ref = new Firebase("https://chataaa.firebaseio.com/chats/" + window.localStorage['userId']);
    var list = $firebaseArray(ref)
    var unwatch = list.$watch(function () {

      list.$loaded()
        .then(function (x) {
          $scope.messages = [];
          angular.forEach(x, function (value, key) {
            var senderId = value.$id;
            var messagesArray = Object.getOwnPropertyNames(value.messages);
            var lastMessageKey = messagesArray[messagesArray.length - 1];
            var lastMessage = value.messages[lastMessageKey].body;
            $scope.messages.push({senderId: senderId, lastMessage: lastMessage});
          }, x);
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
    });
    $scope.goToChat = function (userId) {
      $state.go('chat', {createrId: userId})
    }
  });

