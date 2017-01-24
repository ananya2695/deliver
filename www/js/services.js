angular.module('starter.services', [])

// .factory('Chats', function() {
//   // Might use a resource here that returns a JSON array

//   // Some fake testing data
//   var chats = [{
//     id: 0,
//     name: 'Ben Sparrow',
//     lastText: 'You on your way?',
//     face: 'img/ben.png'
//   }, {
//     id: 1,
//     name: 'Max Lynx',
//     lastText: 'Hey, it\'s me',
//     face: 'img/max.png'
//   }, {
//     id: 2,
//     name: 'Adam Bradleyson',
//     lastText: 'I should buy a boat',
//     face: 'img/adam.jpg'
//   }, {
//     id: 3,
//     name: 'Perry Governor',
//     lastText: 'Look at my mukluks!',
//     face: 'img/perry.png'
//   }, {
//     id: 4,
//     name: 'Mike Harrington',
//     lastText: 'This is wicked good ice cream.',
//     face: 'img/mike.png'
//   }];

//   return {
//     all: function() {
//       return chats;
//     },
//     remove: function(chat) {
//       chats.splice(chats.indexOf(chat), 1);
//     },
//     get: function(chatId) {
//       for (var i = 0; i < chats.length; i++) {
//         if (chats[i].id === parseInt(chatId)) {
//           return chats[i];
//         }
//       }
//       return null;
//     }
//   };
// })

.service('AuthService', ['$http', '$q', function ($http, $q) {

    this.saveUser = function (user) {
      return $http.post('https://thamapp.herokuapp.com/api/auth/signup', user);

    };
    this.loginUser = function (login) {

      var dfd = $q.defer();

      $http.post('https://thamapp.herokuapp.com/api/auth/signin', login).success(function (database) {
        window.localStorage.user = JSON.stringify(database);
        dfd.resolve(database);
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
        // var order = [];
        // console.log(getUser);
        // angular.forEach(db, function (user) {
        //   if (user.namedeliver._id ===   getUser._id) {
        //     order.push(user);
        //   }
        // })
        console.log(orders);
        dfd.resolve(orders);
      });


      return dfd.promise;

    };

    // this.Order = function (orderId) {
    //   var dfd = $q.defer();
    //   $http.get('https://thamapp.herokuapp.com/api/orders').success(function (database) {
    //     var order = _.find(database, function (order) { return order._id == orderId; });

    //     dfd.resolve(order);

    //     console.log(order);
    //   });
    //   return dfd.promise;
    // };


    this.updateOrder = function (orderId,order) {
      console.log(orderId);
       console.log(order);
      // var dfd = $q.defer();
      // $http.put('https://thamapp.herokuapp.com/api/orders/'+orderId, order).success(function (database) {

      //   dfd.resolve(database);
      //   console.log(database);
      // });
      // return dfd.promise;

      return $http.put('https://thamapp.herokuapp.com/api/orders/'+orderId, order);

    }

  }])
