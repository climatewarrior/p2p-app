'use strict';

/* Controllers */
var appControllers = angular.module('p2pControllers', ['ui.bootstrap']);

appControllers.controller('QuestionListCtrl', ['$scope', 'Question',
    function($scope, Question) {
        $scope.questions = Question.query();
}]);

appControllers.controller('QuestionDetailCtrl', ['$modal', '$location',
                                                 '$scope', '$routeParams',
                                                 'Question', 'Auth',
                                                 function($modal, $location, $scope, $routeParams, Question, Auth) {

        $scope.answer = {};

        $scope.question = Question.get({questionId: $routeParams.questionId}, function(question) {
            $scope.mainImageUrl = question.images[0];
        });

        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance) {

          $scope.ok = function () {
            Question.delete({questionId: $routeParams.questionId});
            $modalInstance.close();
            $location.path("/questions");
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        };

        $scope.removePost = function() {
          var modalInstance = $modal.open({
            templateUrl: 'partials/delete_question.html',
            controller: ModalInstanceCtrl
          });
        };

        $scope.userEqualsAuthor = function() {
          return Auth.user.username == $scope.question.submitter;
        };

        $scope.addAns = function() {
            console.log($scope.answer);
            $scope.question.answers.push({votes: 0,
                                          content: $scope.answer.answer,
                                          posted_epoch_time: (new Date).getTime(),
                                          author: Auth.retrieveCredentials()});


            Question.put({questionId: $routeParams.questionId},
                            {"answer":{
                                "content":$scope.answer.answer}});

            $scope.answerForm.$setPristine();
            var defaultForm = {
                answer: ""
            };
            $scope.answer = defaultForm;
        };

    }]);

appControllers.controller('QuestionAskCtrl', ['$scope', '$location', 'Question', function($scope, $location, Question){
    $scope.question = {};
    $scope.alerts = [];

    $scope.addAlert = function() {
        $scope.alerts.push({type: 'success', msg: "Question submitted!"});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.addQuestion = function () {
        Question.save({}, $scope.question);
        $scope.addAlert();
        $location.path("/profile");
    };

    $scope.goNext = function (hash) {
        $location.path(hash);
    };

    $scope.myPictures = [];
    $scope.$watch('myPicture', function(value) {
        if(value) {
            myPictures.push(value);
        }
    }, true);

}]);

appControllers.controller('RegisterCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth){
  $scope.user = {};
  $scope.role = Auth.userRoles.user;
  $scope.userRoles = Auth.userRoles;

  $scope.addUser = function() {
    $scope.user.role = $scope.role;
    Auth.register($scope.user,
                  function() {
                    $location.path('/login');
                  },
                  function(err) {
                    $rootScope.error = err;
                  });
    console.log($scope.user);
  };

}]);

appControllers.controller('LoginCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {

  $scope.user = {};
  $scope.alerts = [];

  $scope.authFailedAlert = function() {
    $scope.alerts.push({type: 'error', msg: "Wrong username or password."});
  };

  $scope.authSuccessAlert = function() {
    $scope.alerts.push({type: 'success', msg: "Logged in."});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.goNext = function (hash) {
    $location.path(hash);
  };

  $scope.login = function() {
    Auth.login({
      username: $scope.user.username,
      password: $scope.user.password,
      rememberme: $scope.userememberme
    },
               function(res) {
                 $scope.authSuccessAlert();
                 $location.path('/questions');
               },
               function(err) {
                 $rootScope.error = "Failed to login";
                 $scope.authFailedAlert();
               });
  };

}]);

appControllers.controller('ProfileCtrl', ['$scope', '$location', '$routeParams', 'User', 'Auth', function($scope, $location, $routeParams, User, Auth) {

        $scope.goNext = function (hash) {
            $location.path(hash);
        };

        $scope.user = User.get({username:$routeParams.username});

        $scope.userEqualsProfile = function() {
          return Auth.user.username == $scope.user.username;
        };

        $scope.logout = function() {
            Auth.logout();
            $location.path("/login");
        };
    }]);

appControllers.controller('OtherAnsCtrl', ['$scope', '$location', '$routeParams', 'OtherAnswers', 'User', function($scope, $location, $routeParams, OtherAnswers, User) {

        $scope.goNext = function (hash) {
            $location.path(hash);
        };
        $scope.user = User.get({username:$routeParams.username});
        $scope.answers = OtherAnswers.getInfo({username:$routeParams.username});
    }]);

appControllers.controller('OtherQnsCtrl', ['$scope', '$location', '$routeParams', 'OtherQuestions', 'User', function($scope, $location, $routeParams, OtherQuestions, User) {

        $scope.goNext = function (hash) {
            $location.path(hash);
        };
		$scope.user = User.get({username:$routeParams.username});
        $scope.questions = OtherQuestions.getInfo({username:$routeParams.username});
    }]);
