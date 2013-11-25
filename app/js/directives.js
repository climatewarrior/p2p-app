'use strict';

/* Directives */

var p2pDirectives = angular.module('p2pDirectives', []);

p2pDirectives.directive('uservote', ['$routeParams', 'Question', function ($routeParams, Question) {
  return {
    restrict: 'E',
    scope: { 'votes': '=data' },
    templateUrl: '../partials/voting.html',
    link : function(scope, element, attrs) {
      scope.upvotedStyle = "{background-color:'orange'}";
      element.find('i').eq(0).on('click', function(event) {
        Question.put({questionId: $routeParams.questionId},
                    {"question": {"vote": "up"}});
      });

      element.find('i').eq(1).on('click', function(event) {
        Question.put({questionId: $routeParams.questionId},
                     {"question": {"vote": "down"}});
      });

    }
  };
}]);

p2pDirectives.directive('camera', function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      elm.on('click', function() {
        navigator.camera.getPicture(function (imageURI) {
          scope.$apply(function() {
            ctrl.$setViewValue(imageURI);
          });
        }, function (err) {
          ctrl.$setValidity('error', false);
        }, { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI });
      });
    }
  };
});
