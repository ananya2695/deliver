angular.module('starter.services', [])

  .service('AuthService', ['$http', '$q', function ($http, $q) {

    this.saveUser = function (user) {
      return $http.post('https://thamapp.herokuapp.com/api/auth/signup', user);

    };
    this.loginUser = function (login) {

      var dfd = $q.defer();

      $http.post('https://thamapp.herokuapp.com/api/auth/signin', login).success(function (database) {
        window.localStorage.user = JSON.stringify(database);
        dfd.resolve(database);
      }).error(function (error) {
        /* Act on the event */
        dfd.resolve(error);
        // return dfd.promise;
      });
      return dfd.promise;
    };

    this.saveUserPushNoti = function(push_user){
      var dfd = $q.defer();

      $http.post('https://thamapp.herokuapp.com/api/pushnotiusers', push_user).success(function (database) {
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
      return true;
    };

    this.getOrder = function () {
      var dfd = $q.defer();
      $http.get('https://thamapp.herokuapp.com/api/orders').success(function (orders) {
        console.log(orders);
        dfd.resolve(orders);
      });
      return dfd.promise;
    };

    this.updateOrder = function (orderId, order) {
      console.log(orderId);
      console.log(order);
      return $http.put('https://thamapp.herokuapp.com/api/orders/' + orderId, order);
    }
  }])

  .service('ProductService', ['$http', '$q', function ($http, $q) { 
    this.getProduct = function () { 
      var dfd = $q.defer(); 
      $http.get('https://thamapp.herokuapp.com/api/products').success(function (products) { 
        console.log(products); 
        dfd.resolve(products); 
      }); 
      return dfd.promise; 
    }; 

      this.postOrder = function (order) { 
         var dfd = $q.defer(); 
       $http.post('https://thamapp.herokuapp.com/api/orders', order).success(function (database) { 
        dfd.resolve(database); 
      }).error(function (error) { 
        /* Act on the event */ 
        dfd.resolve(error); 
        // return dfd.promise; 
      }); 
      return dfd.promise; 
    } 
  }])
