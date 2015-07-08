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
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth',
          function($state, auth) {
            if (auth.isLoggedIn()) {
              $state.go('home');
            }
          }
        ]
      });
    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: '/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth',
          function($state, auth) {
            if (auth.isLoggedIn()) {
              $state.go('home');
            }
          }
        ]
      });
    $urlRouterProvider.otherwise('home');
  }
]);

app.factory('auth', ['$http', '$window',
  function($http, $window) {
    var auth = {};
    auth.saveToken = function(token) {
      $window.localStorage['rxchange-token'] = token;
    };
    auth.getToken = function() {
      return $window.localStorage['rxchange-token'];
    };
    auth.isLoggedIn = function() {
      var token = auth.getToken();

      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };
    auth.currentUser = function() {
      if (auth.isLoggedIn()) {
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.username;
      }
    };
    auth.register = function(user) {
      return $http.post('/register', user).success(function(data) {
        auth.saveToken(data.token);
      });
    };
    auth.logIn = function(user) {
      return $http.post('/login', user).success(function(data) {
        auth.saveToken(data.token);
      });
    };
    auth.logOut = function() {
      $window.localStorage.removeItem('rxchange-token');
    };
    return auth;
  }
]);

app.factory('posts', ['$http', 'auth',

  function($http, auth) {
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
      return $http.post('/posts', post, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      }).success(function(data) {
        o.posts.push(data);
      });
    };
    o.upvote = function(post) {
      return $http.put('/posts/' + post._id + '/upvote', null, {
          headers: {
            Authorization: 'Bearer ' + auth.getToken()
          }
        })
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
      return $http.post('/posts/' + id + '/comments', comment, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      });
    };
    o.upvoteComment = function(post, comment) {
      return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
          headers: {
            Authorization: 'Bearer ' + auth.getToken()
          }
        })
        .success(function(data) {
          comment.upvotes += 1;
        });
    };
    return o;
  }
]);

app.controller('MainCtrl', [
  '$scope', 'posts', 'auth',
  function($scope, posts, auth) {
    $scope.test = 'Hello world!';
    $scope.posts = posts.posts;
    $scope.isLoggedIn = auth.isLoggedIn;
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
  'auth',
  function($scope, posts, post, auth) {
    $scope.post = post;
    $scope.isLoggedIn = auth.isLoggedIn;
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

app.controller('AuthCtrl', [
  '$scope',
  '$state',
  'auth',
  function($scope, $state, auth) {
    $scope.user = {};

    $scope.register = function() {
      auth.register($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('home');
      });
    };

    $scope.logIn = function() {
      auth.logIn($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('home');
      });
    };
  }
]);

app.controller('NavCtrl', [
  '$scope',
  'auth',
  function($scope, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
  }
]);
