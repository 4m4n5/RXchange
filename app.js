var app = angular.module('RXchange', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope) {
    $scope.test = 'Hello world!';
    $scope.posts = [{
      room_no: 'post 1',
      interests: 5,
      name: 'foo'
    }, {
      room_no: 'post 2',
      interests: 2,
      name: 'foo'
    }, {
      room_no: 'post 3',
      interests: 15,
      name: 'foo'
    }, {
      room_no: 'post 4',
      interests: 9,
      name: 'foo'
    }, {
      room_no: 'post 5',
      interests: 4,
      name: 'foo'
    }];

    $scope.addPost = function() {
      if (!$scope.room_no || $scope.room_no === '' || !$scope.name || $scope.name === '') {
        return;
      }
      $scope.posts.push({
        room_no: $scope.room_no,
        name: $scope.name,
        interests: 0
      });
      $scope.room_no = '';
      $scope.name = '';
    };
    $scope.incrementInterests = function(post) {
      post.interests += 1;
    };
  }
]);