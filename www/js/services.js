angular.module('starter.services', [])

  .service('AuthService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapp.herokuapp.com/api';
    this.saveUser = function (user) {
      return $http.post(apiURL + '/auth/signup', user);

    };
    this.loginUser = function (login) {
      window.localStorage.credential = JSON.stringify(login);
      var dfd = $q.defer();

      $http.post(apiURL + '/auth/signin', login).success(function (database) {
        window.localStorage.user = JSON.stringify(database);
        // alert('Success'); 
        dfd.resolve(database);
      }).error(function (error) {
        /* Act on the event */
        dfd.resolve(error);
        // return dfd.promise;
      });
      return dfd.promise;
    };

    this.saveUserPushNoti = function (push_user) {
      var dfd = $q.defer();

      $http.post(apiURL + '/pushnotiusers', push_user).success(function (database) {
        dfd.resolve(database);
      }).error(function (error) {
        /* Act on the event */
        console.log(error);
        dfd.resolve(error);
        // return dfd.promise;
      });
      return dfd.promise;
    };

    this.getUser = function () {
      return JSON.parse(window.localStorage.user || null);
    };

    this.signOut = function () {
      // window.localStorage.clear();
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('credential');
      return true;
    };

     this.updateUser = function (userX) {
       var user = this.getUser();
      return $http.put(apiURL + '/users' , userX,user);
    };

    this.getOrder = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/orders').success(function (orders) {
        //console.log(orders);
        dfd.resolve(orders);
      });
      return dfd.promise;
    };

    this.updateOrder = function (orderId, order) {
      console.log(orderId);
      console.log(order);
      return $http.put(apiURL + '/orders/' + orderId, order);
    }
  }])


  .service('ProductService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapp.herokuapp.com/api';
    this.getProduct = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/products').success(function (products) {
        console.log(products);
        dfd.resolve(products);
      });
      return dfd.promise;
    };

    this.postOrder = function (order) {
      var dfd = $q.defer();
      $http.post(apiURL + '/orders', order).success(function (database) {
        dfd.resolve(database);
      }).error(function (error) {
        /* Act on the event */
        dfd.resolve(error);
        // return dfd.promise; 
      });
      return dfd.promise;
    }

    this.deleteOrder = function (orderId) {
       var dfd = $q.defer();
      $http.delete(apiURL + '/orders/' + orderId).success(function (database) {
        dfd.resolve(database);
      }).error(function (error) {
        /* Act on the event */
        dfd.reject(error);
        // return dfd.promise; 
     
      });
      return dfd.promise;
    
    }

  }])
