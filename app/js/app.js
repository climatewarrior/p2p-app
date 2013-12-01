'use strict';


// Declare app level module which depends on filters, and services
var p2pApp = angular.module('p2pApp', [
  'ngRoute',
  'ngTouch',
  'ngCookies',
  'p2pFilters',
  'p2pServices',
  'p2pDirectives',
  'p2pControllers'
]);

p2pApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

  var access = routingConfig.accessLevels;

  $routeProvider.when('/questions',
                      {templateUrl: 'partials/question-list.html',
                       controller: 'QuestionListCtrl',
                       data: {
                         access: access.public}
                      });

  $routeProvider.when('/questions/:questionId',
                      {templateUrl: 'partials/question-detail.html',
                       controller: 'QuestionDetailCtrl',
                       data: {
                         access: access.public}
                      });

  $routeProvider.when('/ask',
                      {templateUrl: 'partials/question-ask.html',
                       controller: 'QuestionAskCtrl',
                       data: {
                         access: access.user}
                      });

  $routeProvider.when('/login',
                      {templateUrl: 'partials/login.html',
                       controller: 'LoginCtrl',
                       data: {
                         access: access.public}
                      });

  $routeProvider.when('/register',
                      {templateUrl: 'partials/register.html',
                       controller: 'RegisterCtrl',
                       data: {
                         access: access.public}
                      });

  $routeProvider.when('/userQns/:username',
                      {templateUrl: 'partials/question-other-question.html',
                       controller: 'OtherQnsCtrl',
                       data: {
                         access: access.public}
                      });

  $routeProvider.when('/userAns/:username',
                      {templateUrl: 'partials/question-other-answer.html',
                       controller: 'OtherAnsCtrl',
                       data: {
                         access: access.public}
                      });

  $routeProvider.when('/profile',
                      {templateUrl: 'partials/profile.html',
                       controller: 'ProfileCtrl',
                       data: {
                         access: access.user}
                      });

  $routeProvider.when('/user/:username',
                      {templateUrl: 'partials/profile.html',
                       controller: 'ProfileCtrl',
                       data: {
                         access: access.user}
                      });

  $routeProvider.when('/404',
                      {templateUrl: 'partials/404.html',
                       data: {
                         access: access.public}
                      });

  $routeProvider.otherwise({redirectTo:'/404'});

  // var interceptor = ['$location', '$q', function($location, $q) {
  //   function success(response) {
  //     return response;
  //   }

  //   function error(response) {

  //     if(response.status === 401) {
  //       $location.path('/login');
  //       return $q.reject(response);
  //     }

  //     else {
  //       return $q.reject(response);
  //     }
  //   }

  //   return function(promise) {
  //     return promise.then(success, error);
  //   };
  // }];

  // $httpProvider.responseInterceptors.push(interceptor);

}]);

p2pApp.run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      Auth.retrieveCredentials();

      $rootScope.error = null;
      if (!Auth.authorize(next.data.access)) {
        if (Auth.isLoggedIn()) {
          console.log("biatch");
          $location.path('/');
        }
        else {
          console.log("here biach");
          $location.path('/login');
        }
      }
    });
}]);
