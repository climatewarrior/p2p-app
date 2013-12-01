'use strict';

/* Services */

var p2pServices = angular.module('p2pServices', ['ngResource']);

p2pServices.factory('Question', ['$resource',
    function($resource){
        return $resource('questions/:questionId', {}, {
            query: {method:'GET',
                    params:{questionId:''},
                    isArray:true},
            put: {method:'PUT'}
        });
}]);

p2pServices.factory('User', ['$resource',
    function($resource){
        return $resource('user/:username', {}, {
            getInfo: {method:'GET'}
        });
}]);

p2pServices.factory('OtherQuestions', ['$resource',
    function($resource){
        return $resource('user/:username/question', {}, {
            save: {method:'POST'},
            getInfo: {method:'GET', isArray:true}
        });
}]);

p2pServices.factory('OtherAnswers', ['$resource',
    function($resource){
        return $resource('user/:username/answer', {}, {
            save: {method:'POST'},
            getInfo: {method:'GET', isArray:true}
        });
}]);

p2pServices.factory('Auth', ['Base64', '$cookieStore', '$http', function (Base64, $cookieStore, $http) {

  var accessLevels = routingConfig.accessLevels
  , userRoles = routingConfig.userRoles
  , currentUser = angular.fromJson($cookieStore.get('user')) || { username: '', role: userRoles.public };

  function changeUser(user) {
    _.extend(currentUser, user);
  };

  return {
    authorize: function(accessLevel, role) {
      if(role === undefined) {
        role = currentUser.role;
        console.log("ROLE");
        console.log(role);
        console.log(accessLevel);
      }

      return accessLevel.bitMask & role.bitMask;
    },
    isLoggedIn: function(user) {
      if(user === undefined) {
        user = currentUser;
      }
      return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
    },
    register: function(user, success, error) {
      $http.post('/user', user).success(function(res) {
        changeUser(res);
        success();
      }).error(error);
    },
    login: function(user, success, error) {
      var encoded = Base64.encode(user.username + ':' + user.password);
      $http({method: 'GET',
             url: 'test_auth',
             headers: {
               'Authorization': 'Basic ' + encoded
             }}).success(function(user){
               changeUser(user);
               success(user);
               $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
               $cookieStore.put('user', JSON.stringify(user));
               $cookieStore.put('authdata', encoded);
               $cookieStore.put('username', user.username);
             }).error(error);
    },
    logout: function () {
      changeUser({
        username: '',
        role: userRoles.public
      });
      document.execCommand("ClearAuthenticationCache");
      $cookieStore.remove('authdata');
      $cookieStore.remove('username');
      $cookieStore.remove('user');
      $http.defaults.headers.common.Authorization = 'Basic ';
    },
    accessLevels: accessLevels,
    userRoles: userRoles,
    user: currentUser,
    retrieveCredentials: function() {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');
      currentUser = angular.fromJson($cookieStore.get('user')) || { username: '', role: userRoles.public };

      return $cookieStore.get('username');
    }
  };
}]);

p2pServices.factory('cordovaReady', [function () {
        return function (fn) {
            var queue = [],
            impl = function () {
                queue.push([].slice.call(arguments));
            };

            document.addEventListener('deviceready', function () {
                queue.forEach(function (args) {
                    fn.apply(this, args);
                });
                impl = fn;
            }, false);

            return function () {
                return impl.apply(this, arguments);
            };
        };
    }]);

p2pServices.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});
