app.controller('MainCtrl', ['$scope', '$rootScope', 'posts', 'auth',
  function($scope, $rootScope, posts, auth) {

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
        bhawan: $scope.bhawan,
        preference: $scope.preference,
        mobile: $scope.mobile,
        email: $scope.email,
        interests: 0,
      });
      $scope.room_no = '';
      $scope.name = '';
      $scope.bhawan = '';
      $scope.preference = '';
      $scope.mobile = '';
      $scope.email = '';
    };

    $scope.incrementInterests = function(post) {
      posts.upvote(post);
    };
  }
]);

app.controller('PostsCtrl', ['$scope', 'posts', 'post', 'auth',
  function($scope, posts, post, auth) {

    $scope.post = post;
    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.incrementUpvotes = function(comment) {
      posts.upvoteComment(post, comment);
    };

    $scope.addComment = function() {
      if (!$scope.body || $scope.body === '') {
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

app.controller('AuthCtrl', ['$scope', '$state', 'auth',
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

app.controller('NavCtrl', ['$scope', '$rootScope', 'auth',
  function($scope, $rootScope, auth) {
    $rootScope.viewForm = false;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
  }
]);
