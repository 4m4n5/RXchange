var app = angular.module('RXchange', ['ui.router']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts',
            function(posts) {
              return posts.getAll();
            }
          ]
        }
      });
    $stateProvider
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
          post: ['$stateParams', 'posts',
            function($stateParams, posts) {
              return posts.get($stateParams.id);
            }
          ]
        }
      });
    $urlRouterProvider.otherwise('home');
  }
]);

app.factory('posts', ['$http',

  function($http) {
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
    o.getAll = function() {
      return $http.get('/posts').success(function(data) {
        angular.copy(data, o.posts);
      });
    };
    o.create = function(post) {
      return $http.post('/posts', post).success(function(data) {
        o.posts.push(data);
      });
    };
    o.upvote = function(post) {
      return $http.put('/posts/' + post._id + '/upvote')
        .success(function(data) {
          post.interests += 1;
        });
    };
    o.get = function(id) {
      return $http.get('/posts/' + id).then(function(res) {
        return res.data;
      });
    };
    o.addComment = function(id, comment) {
      return $http.post('/posts/' + id + '/comments', comment);
    };
    o.upvoteComment = function(post, comment) {
      return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
        .success(function(data) {
          comment.upvotes += 1;
        });
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
      posts.create({
        room_no: $scope.room_no,
        name: $scope.name,
        preference: $scope.preference,
        mobile: $scope.mobile,
        email: $scope.email,
        password: $scope.password,
        interests: 0,
      });
      $scope.room_no = '';
      $scope.name = '';
      $scope.preference = '';
      $scope.mobile = '';
      $scope.email = '';
      $scope.password = '';
    };
    $scope.incrementInterests = function(post) {
      console.log(post);
      posts.upvote(post);
    };
  }
]);

app.controller('PostsCtrl', [
  '$scope',
  'posts',
  'post',
  function($scope, posts, post) {
    $scope.post = post;
    $scope.incrementUpvotes = function(comment) {
      posts.upvoteComment(post, comment);
    };
    $scope.addComment = function() {
      if ($scope.body === '') {
        return;
      }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };
  }
]);
