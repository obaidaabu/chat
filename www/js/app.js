(function() {
var app = angular.module('ionicApp', ['ionic','firebase','controllers','services','pubnub.angular.service']);

app.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);


      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
  .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    });
    $stateProvider.state('chat', {
      url: '/chat/:createrId',
      templateUrl: 'templates/chat.html',
      controller:"ChatCtrl"
    });
    $stateProvider.state('addSubjects', {
      url: '/addSubjects',
      templateUrl: 'templates/add-subjects.html'
    });
    $stateProvider.state('subjects', {
      url: '/subjects',
      templateUrl: 'templates/subjects.html',
      controller:"SubjectsCtrl"
    });
    $stateProvider.state('messages', {
      url: '/messages',
      templateUrl: 'templates/messages.html',
      controller:"MessagesCtrl"
    });
    $urlRouterProvider.otherwise('/login');
  }) .directive('input', function($timeout) {
    return {
      restrict: 'E',
      scope: {
        'returnClose': '=',
        'onReturn': '&',
        'onFocus': '&',
        'onBlur': '&'
      },
      link: function(scope, element, attr) {
        element.bind('focus', function(e) {
          if (scope.onFocus) {
            $timeout(function() {
              scope.onFocus();
            });
          }
        });
        element.bind('blur', function(e) {
          if (scope.onBlur) {
            $timeout(function() {
              scope.onBlur();
            });
          }
        });
        element.bind('keydown', function(e) {
          if (e.which == 13) {
            if (scope.returnClose) element[0].blur();
            if (scope.onReturn) {
              $timeout(function() {
                scope.onReturn();
              });
            }
          }
        });
      }
    }
  });

}());
// All this does is allow the message
// to be sent when you tap return




