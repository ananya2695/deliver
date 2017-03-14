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
      return $http.put(apiURL + '/users', userX, user);
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

  .service('RequestService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapp.herokuapp.com/api';
    this.getRequests = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/requestorders').success(function (requestorders) {
        console.log(requestorders);
        dfd.resolve(requestorders);
      });
      return dfd.promise;
    };
    this.updateRequestOrder = function (requestorderId, requestorder) {
      var dfd = $q.defer();
      $http.put(apiURL + '/requestorders/' + requestorderId, requestorder).success(function (requestorders) {
        console.log(requestorders);
        dfd.resolve(requestorders);
      }).error(function (error) { 
        /* Act on the event */ 
        dfd.reject(error); 
        // return dfd.promise; 
      }); 
      return dfd.promise; 
    };
  }])

  .service('ReturnService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapp.herokuapp.com/api';
    this.getReturns = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/returnorders').success(function (returnorders) {
        console.log(returnorders);
        dfd.resolve(returnorders);
      });
      return dfd.promise;
    };
    this.updateReturnOrder = function (returnordersId, returnorder) {
      var dfd = $q.defer();
      $http.put(apiURL + '/returnorders/' + returnordersId, returnorder).success(function (returnorders) {
        console.log(returnorders);
        dfd.resolve(returnorders);
      });
      return dfd.promise;
    };
  }])

  .service('AccuralService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapp.herokuapp.com/api';
    this.getAccurals = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/accuralreceipts').success(function (accuralreceipts) {
        console.log(accuralreceipts);
        dfd.resolve(accuralreceipts);
      });
      return dfd.promise;
    };
    this.updateAccuralOrder = function (accuralreceiptsId, accuralreceipts) {
      var dfd = $q.defer();
      $http.put(apiURL + '/accuralreceipts/' + accuralreceiptsId, accuralreceipts).success(function (accuralreceipts) {
        console.log(accuralreceipts);
        dfd.resolve(accuralreceipts);
      }).error(function (error) { 
        /* Act on the event */ 
        dfd.reject(error); 
        // return dfd.promise; 
      }); 
      return dfd.promise; 
    };
  }])

  .service('StockService', ['$http', '$q', function ($http, $q) {
    var apiURL = 'https://thamapp.herokuapp.com/api';
    this.getStocks = function () {
      var dfd = $q.defer();
      $http.get(apiURL + '/stocks').success(function (stocks) {
        console.log(stocks);
        dfd.resolve(stocks);
      });
      return dfd.promise;
    };
    
  }]);
