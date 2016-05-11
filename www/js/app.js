(function () {
  var app = angular.module('starter', ['ionic', 'controllers', 'services', 'directives','firebase', 'ngCordova']);

  app.run(function ($ionicPlatform, $state) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {

        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);


        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      var uuid = window.localStorage['userId'];
      if (uuid && uuid != 'undefined') {

        $state.go("tab.subjects");
      }
      else {
        $state.go("login");
      }
    });
  })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
      //$ionicConfigProvider.views.maxCache(0);

      $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: "LoginCtrl"
      })

        .state('chat', {
          url: '/chat/:createrId',
          templateUrl: 'templates/chat.html',
          controller: "ChatCtrl"
        })
        .state('addSubject', {
          url: '/addSubject',
          templateUrl: 'templates/add-subject.html',
          controller: "addSubjectsCtrl"
        })

        //$stateProvider.state('messages', {
        //  url: '/messages',
        //  templateUrl: 'templates/messages.html',
        //  controller:"MessagesCtrl"
        //});
        .state('tab', {
          url: '/tab',
          templateUrl: 'templates/tabs.html',
          controller: "TabsCtrl"
        })
        .state('tab.subjects', {
          url: '/subjects',
          views: {
            'subjects-page': {
              templateUrl: 'templates/subjects.html',
              controller: "SubjectsCtrl"
            }
          }
        })
        .state('tab.messages', {
          url: '/messages',
          views: {
            'messages-page': {
              templateUrl: 'templates/messages.html',
              controller: "MessagesCtrl"
            }
          }
        });
    })
}());
// All this does is allow the message
// to be sent when you tap return




