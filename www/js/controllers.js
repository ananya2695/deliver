angular.module('starter.controllers', [])

  .controller('LogInCtrl', function ($scope, $state, AuthService) {
    $scope.credentials = {}

    $scope.doLogIn = function (credentials) {
      var login = {
        username: credentials.username,
        password: credentials.password
      }
      AuthService.loginUser(login)
        .then(function (response) {
          // alert('success');
          $state.go('tab.dash');
        }, function (error) {
          console.log(error);
          alert('Invalid username or password');
        });
      // console.log("doing sign up");

    };
  })

  // .controller('AuthenticationCtrl', function($scope ,$http, $state) {
  //   console.log('ok');
  //    $http.get('https://thamapp.herokuapp.com/authentication/signin')
  //    .then(function(res){
  //      console.log(res);
  //      $scope.userAuthen = res.user;
  //    }, function(error){
  //      console.log(error);
  //    })
  //    $scope.Login = function(user){
  //      $state.go('tab.dash');
  //    }
  // })

  .controller('DashCtrl', function ($scope, $http, $state, AuthService, $stateParams) {
    $scope.btnGo = function (data) {

      console.log(data);
      $state.go('tab.orderdetail', { data: JSON.stringify(data) });
    }

    var orderId = $stateParams.orderId;
    console.log(orderId);
    // AuthService.Order(orderId).then(function (order) {
    //   $scope.order = order;
    // });
    $scope.init = function () {
      $scope.readOrder();
    };
    $scope.acceptDeliver = function (item) {
      var listApt =
        {
          status: 'accept',
          datestatus: new Date()
        };
      item.historystatus.push(listApt);

      var status = item.deliverystatus;
      status = 'accept';
      var order = {
        deliverystatus: status,
        historystatus: item.historystatus
      }
      var orderId = item._id;


      AuthService.updateOrder(orderId, order)
        .then(function (response) {
          alert('success');
          $scope.init();
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });

    };
    $scope.rejectDeliver = function (item) {
      var namedeli = item.namedeliver;
      namedeli = null;
      var status = item.deliverystatus;
      status = 'reject';
      var listApt = {
        status: 'reject',
        datestatus: new Date()
      }
      item.historystatus.push(listApt);
      var order = {
        namedeliver: namedeli,
        deliverystatus: status,
        historystatus: item.historystatus
      }
      var orderId = item._id;

      AuthService.updateOrder(orderId, order)
        .then(function (response) {
          alert('success');
          $scope.init();
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });

      // console.log(item);
    };
    $scope.doRefresh = function () {
      $scope.init();
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

    };
    $scope.readOrder = function () {
      $scope.orders = [];
      AuthService.getOrder()
        .then(function (data) {
          var userStore = AuthService.getUser();
          var orderlist = data;
          angular.forEach(orderlist, function (user) {
            if (user.namedeliver) {
              if (user.namedeliver._id === userStore._id) {
                if (user.deliverystatus === 'confirmed' || user.deliverystatus === 'wait deliver') {
                  $scope.orders.push(user);
                }

              }
            }

          })
          console.log($scope.orders);
        });
    }
  })

  .controller('ChatsCtrl', function ($scope, $http, $state, AuthService, $stateParams) {
    $scope.btnGo = function (data) {

      console.log(data);
      $state.go('tab.chat-detail', { data: JSON.stringify(data) });
    }

    $scope.completeDeliver = function (item) {

      var status = item.deliverystatus;
      status = 'complete';
      var listApt = {
        status: 'complete',
        datestatus: new Date()
      }
      item.historystatus.push(listApt);
      var order = {
        deliverystatus: status,
        historystatus: item.historystatus
      }
      var orderId = item._id;

      AuthService.updateOrder(orderId, order)
        .then(function (response) {
          alert('success');
          $scope.init();
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });

      // console.log(item);
    };
    $scope.init = function () {
      AuthService.getOrder()
        .then(function (data) {
          var userStore = AuthService.getUser();
          var orderlist = data;
          $scope.ordersApt = [];
          angular.forEach(orderlist, function (user) {
            if (user.namedeliver) {
              if (user.namedeliver._id === userStore._id && user.deliverystatus === 'accept') {
                $scope.ordersApt.push(user);
              }
            }

          })
          console.log($scope.ordersApt);
        });
    }
    $scope.doRefresh = function () {
      $scope.init();
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

    };


  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams) {
    console.log(JSON.parse($stateParams.data));
    $scope.data = JSON.parse($stateParams.data);
  })

  .controller('OrderDetailCtrl', function ($scope, $stateParams) {
    console.log(JSON.parse($stateParams.data));
    $scope.data = JSON.parse($stateParams.data);
  })


  // .controller('AccountCtrl', function ($scope, $http, $state, AuthService, $stateParams) {

  // })

  .controller('MapCtrl', function ($scope, $http, $state, AuthService, $stateParams, $cordovaGeolocation) {
    console.log('ok');

    var locations = [
      [13.9351084, 100.715099],
      [13.9341505, 100.7141161],
      [13.9347128, 100.7163853]
    ]
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: new google.maps.LatLng(13.9351084, 100.715099), //เปลี่ยนตามต้องการ
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    for (var i = 0; i < locations.length; i++) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][0], locations[i][1]),
        map: map
      });
    }

    $scope.map = map;
  })

  .controller('SettingCtrl', function ($scope, $http, $state, AuthService, $stateParams) {
    $scope.doLogOut = function () {
      AuthService.signOut();

      $state.go('authen');
    };

  });
