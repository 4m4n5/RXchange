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
        angular.forEach(data, function(value, index) {
          value.showContacts = false; // Only for frontend display purposes
        });
        angular.copy(data, o.posts);
      });
    };

    o.create = function(post) {
      return $http.post('/posts', post, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      }).success(function(data) {
        data.showContacts = false;
        o.posts.push(data);
      });
    };

    o.upvote = function(post) {
      return $http.put('/posts/' + post._id + '/upvote', null, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      }).success(function(data) {
        post.interests += 1;
      });
    };

    o.get = function(id) {
      return $http.get('/posts/' + id).then(function(res) {
        res.data.showContacts = false;
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
      }).success(function(data) {
        comment.upvotes += 1;
      });
    };

    return o;
  }
]);
