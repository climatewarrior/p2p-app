'use strict';

/* Directives */

var p2pDirectives = angular.module('p2pDirectives', []);

p2pDirectives.directive('uservote', ['$routeParams', 'Question', function ($routeParams, Question) {
  return {
    restrict: 'E',
    scope: { 'votes': '=votes',
             'answer_id' : '=data'},
    templateUrl: '../partials/voting.html',
    link : function(scope, element, attrs) {
      element.find('i').eq(0).on('click', function(event) {
        if(scope.answer_id) {
          Question.put({questionId: $routeParams.questionId},
                       {"answer": {"vote": "up",
                                  "answer_id": scope.answer_id}});
        }
        else {
          Question.put({questionId: $routeParams.questionId},
                       {"question": {"vote": "up"}});
        }

        scope.upvotedStyle = {'background-color':'green'};
        scope.votes = scope.votes + 1;
      });

      element.find('i').eq(1).on('click', function(event) {
        if(scope.answer_id) {
          Question.put({questionId: $routeParams.questionId},
                       {"answer": {"vote": "down",
                                   "answer_id": scope.answer_id}});
        }
        else {
          Question.put({questionId: $routeParams.questionId},
                       {"question": {"vote": "down"}});
        }

        scope.downvotedStyle = {'background-color':'red'};
        scope.votes = scope.votes - 1;
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
