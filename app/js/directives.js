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

      var voteQuestion = function(direction) {
        Question.put({questionId: $routeParams.questionId},
                     {"question": {"vote": direction}});
      };

      var voteAnswer = function(direction) {
        Question.put({questionId: $routeParams.questionId},
                     {"answer": {"vote": direction,
                                 "answer_id": scope.answer_id}});
      };

      element.find('i').eq(0).on('click', function(event) {
        if (!scope.upvoted) {
          if (scope.answer_id) {
            voteAnswer("up");
          }
          else {
            voteQuestion("up");
          }

          scope.upvotedStyle = {'background-color':'green'};
          scope.downvotedStyle = {'background-color':''};
          scope.votes = scope.votes + 1;
          scope.upvoted = true;

        }
        else {
          scope.upvoted = false;
          scope.votes = scope.votes - 1;
          scope.upvotedStyle = {'background-color':''};

          if (scope.answer_id) {
            voteAnswer("down");
          }
          else {
            voteQuestion("down");
          }
        }
      });

      element.find('i').eq(1).on('click', function(event) {
        if (!scope.downvoted) {
          if (scope.answer_id) {
            voteAnswer("down");
          }
          else {
            voteQuestion("down");
          }

          scope.downvotedStyle = {'background-color':'red'};
          scope.upvotedStyle = {'background-color':''};
          scope.votes = scope.votes - 1;
          scope.downvoted = true;
        }
        else {
          scope.downvoted = false;
          scope.votes = scope.votes + 1;
          scope.downvotedStyle = {'background-color':''};

          if (scope.answer_id) {
            voteAnswer("up");

          }
          else {
            voteQuestion("up");
          }
        }
      }
                                );

    }
  };
}]);

p2pDirectives.directive('myself', ['Auth', function (Auth) {
  return {
    restrict: 'E',
    scope: { 'id': '=id'},
    link : function(scope, element, attrs) {
      var prevDisp = element.css('display');

      scope.$watch('id', function(id) {
        console.log(scope.id);
        if (Auth.user.username != scope.id) {
          element.css('display', 'none');
        }
        else {
          element.css('display', prevDisp);
        }
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


p2pDirectives.directive('accessLevel', ['Auth', function(Auth) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var prevDisp = element.css('display')
        , userRole
        , accessLevel;

        $scope.user = Auth.user;
        $scope.$watch('user', function(user) {
          if(user.role)
            userRole = user.role;
          updateCSS();
        }, true);

        attrs.$observe('accessLevel', function(al) {
          if(al) accessLevel = $scope.$eval(al);
          updateCSS();
        });

        function updateCSS() {
          if(userRole && accessLevel) {
            if(!Auth.authorize(accessLevel, userRole))
              element.css('display', 'none');
            else
              element.css('display', prevDisp);
          }
        }
      }
    };
  }]);
