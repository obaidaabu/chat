angular.module('controllers', [])
  .controller('TabsCtrl', function ($scope, $ionicSideMenuDelegate) {

    $scope.openMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    }

  })
  .controller('AppCtrl', function ($scope, $state) {

    $scope.addSubjectView = function () {
      $state.go('addSubject');
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
    $scope.conversationId = $state.params.conversationId;

    $scope.userId = window.localStorage['userId'];
    var myUrl = "https://chataaa.firebaseio.com/chats/" + window.localStorage['userId'] + "/" + $scope.conversationId;
    var ref = new Firebase(myUrl + "/messages");
    var list = $firebaseArray(ref);
    var isFirstMessage = false;
    //var unwatch = list.$watch(function () {

    list.$loaded()
      .then(function (x) {
        $scope.messages = x;
        if (x.length == 0) {
          isFirstMessage = true;
        }
      });


    //});
    $scope.sendMessage = function () {
      var otherUrl = "https://chataaa.firebaseio.com/chats/" + $scope.conversationId.split("-")[0] + "/" + window.localStorage['userId'] + '-' + $scope.conversationId.split("-")[1];
      var ref2, ref1;
      debugger
      if (isFirstMessage) {
        ref2 = new Firebase(otherUrl);
        ref1 = new Firebase(myUrl);
        var newMessageRef1 = ref1.push();
        ref1.set({messages: [{body: $scope.messageContent, sender: window.localStorage['userId']}],userName:$state.params.userName,subjectName:$state.params.subjectName});
        var newMessageRef2 = ref2.push();
        ref2.set({messages: [{body: $scope.messageContent, sender: window.localStorage['userId']}],userName:$state.params.userName,subjectName:$state.params.subjectName});
        isFirstMessage=false;
      }
      else {
        ref2 = new Firebase(otherUrl + "/messages");
        ref1 = new Firebase(myUrl + "/messages");
        var newMessageRef1 = ref1.push();
        newMessageRef1.set({body: $scope.messageContent, sender: window.localStorage['userId']});
        var newMessageRef2 = ref2.push();
        newMessageRef2.set({body: $scope.messageContent, sender: window.localStorage['userId']});
      }


      delete $scope.messageContent;
    }

  })

  .
  controller('LoginCtrl', function ($scope, $state, $ionicPlatform, UserService) {
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
      $state.go('chat', {conversationId: subject.user._id + "-" + subject._id,userName:subject.user.userName,subjectName:subject.title})
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
            debugger
            var conversationId = value.$id;
            var messagesArray = Object.getOwnPropertyNames(value.messages);
            var lastMessageKey = messagesArray[messagesArray.length - 1];
            var lastMessage = value.messages[lastMessageKey].body;
            $scope.messages.push({conversationId: conversationId, lastMessage: lastMessage,subjectName:value.subjectName,userName:value.userName});
          }, x);
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
    });
    $scope.goToChat = function (conversationId) {
      $state.go('chat', {conversationId: conversationId})
    }
  });

