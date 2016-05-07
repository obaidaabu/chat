angular.module('directives', [])
  .directive('headerBar', function() {
    return {
      restrict: 'E',
      templateUrl: 'shared/header-bar.html'
    }
  })
  .directive('headerBackCreateBar', function() {
    return {
      restrict: 'E',
      templateUrl: 'shared/header-back-create.html'
    }
  });
