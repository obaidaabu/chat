angular.module('services', [])
  .factory('ConfigurationService', function () {
    return {
      ServerUrl: function () {
        return "https://chatad.herokuapp.com";
          //return "http://localhost:3000";
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
      GetSubjects: function (userID) {
        var deferred = $q.defer();
        $http.get(ConfigurationService.ServerUrl() + '/api/subjects?_id='+userID , {
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
            "user" : subject.user,
            "description": subject.description
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
      },
      DeleteSubjects: function (subject) {
        var deferred = $q.defer();
        $http.delete(ConfigurationService.ServerUrl() + '/api/subjects?_id='+ subject._id, {
          headers: {

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
  .factory('EntityService', function () {
    var deleteFromArray = function(array,item){
      for(var i=0; i<array.length;i++){
        if(array[i]._id == item._id) {
          array.splice(i,1);
        }
      }
    };
    return {
      deleteFromArray : deleteFromArray

    };
  });
