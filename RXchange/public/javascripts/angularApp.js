var app = angular.module('RXchange', ['ui.router']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      });
    $stateProvider
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
      });
    $urlRouterProvider.otherwise('home');
  }
]);

app.factory('posts', [

  function() {
    var o = {
      posts: [{
        room_no: 'post 1',
        interests: 5,
        name: 'foo',
        comments: [{
          author: 'Bablooo',
          body: 'Alag he machai!',
          upvotes: 0
        }, {
          author: 'Tiploo',
          body: 'Girls hostel dikhta hai iha se!',
          upvotes: 10
        }]
      }]
    };
    return o;
  }
]);

app.controller('MainCtrl', [
  '$scope', 'posts',
  function($scope, posts) {
    $scope.test = 'Hello world!';
    $scope.posts = posts.posts;
    // $scope.posts = [{
    //   room_no: 'post 1',
    //   interests: 5,
    //   name: 'foo'
    // }, {
    //   room_no: 'post 2',
    //   interests: 2,
    //   name: 'foo'
    // }, {
    //   room_no: 'post 3',
    //   interests: 15,
    //   name: 'foo'
    // }, {
    //   room_no: 'post 4',
    //   interests: 9,
    //   name: 'foo'
    // }, {
    //   room_no: 'post 5',
    //   interests: 4,
    //   name: 'foo'
    // }];

    $scope.addPost = function() {
      if (!$scope.room_no || $scope.room_no === '' || !$scope.name || $scope.name === '') {
        return;
      }
      $scope.posts.push({
        room_no: $scope.room_no,
        name: $scope.name,
        interests: 0,
        comments: [{
          author: 'Bablooo',
          body: 'Alag he machai!',
          upvotes: 0
        }, {
          author: 'Tiploo',
          body: 'Girls hostel dikhta hai iha se!',
          upvotes: 10
        }]
      });
      $scope.room_no = '';
      $scope.name = '';
    };
    $scope.incrementInterests = function(post) {
      post.interests += 1;
    };
  }
]);

app.controller('PostsCtrl', [
  '$scope',
  '$stateParams',
  'posts',
  function($scope, $stateParams, posts) {
    $scope.post = posts.posts[$stateParams.id];
    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    };
    $scope.addComment = function() {
      if ($scope.body === '') {
        return;
      }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };
  }
]);
