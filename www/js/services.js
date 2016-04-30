angular.module('services', [])
  .factory('ConfigurationService', function () {
    return {
      ServerUrl: function () {
        return "https://chatad.herokuapp.com";
         // return "http://10.0.0.4:3000";
      }
    }
  })
  .factory('UserService', function ($http, $log, $q, ConfigurationService) {
    return {

      CreateUser: function (user) {
        var deferred = $q.defer();
        $http.post(ConfigurationService.ServerUrl() + '/api/users',
          {
            "userName": user.userName,
            "password": user.pass
          }
          , {
            headers: {
              "Content-Type":"application/json"
            }
          }).success(function (data) {
            deferred.resolve(data);
          }).error(function (msg, code) {
            deferred.reject(msg);
            //   $log.error(msg, code);
          });
        return deferred.promise;
      }
    }
  })
  .factory('SubjectService', function ($http, $log, $q, ConfigurationService) {
    return {
      GetSubjects: function () {
        var deferred = $q.defer();
        $http.get(ConfigurationService.ServerUrl() + '/api/subjects' , {
          headers: {

          }
        }).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
          //   $log.error(msg, code);
        });
        return deferred.promise;
      },
      CreateSubject: function (subject) {
        var deferred = $q.defer();
        $http.post(ConfigurationService.ServerUrl() + '/api/subjects',
          {
            "title":subject.title,
            "user" : subject.user
          }
          , {
            headers: {
              "Content-Type":"application/json"
            }
          }).success(function (data) {
            deferred.resolve(data);
          }).error(function (msg, code) {
            deferred.reject(msg);
            //   $log.error(msg, code);
          });
        return deferred.promise;
      }
    }
  });
