angular.module('starter.controllers', [])

  .controller('LogInCtrl', function ($scope, $state, AuthService, $ionicPopup) {
    $scope.userStore = AuthService.getUser();
    if ($scope.userStore) {
      var push_usr = {
        user_id: $scope.userStore._id,
        user_name: $scope.userStore.username,
        role: 'deliver',
        device_token: JSON.parse(window.localStorage.token || null)
      };
      AuthService.saveUserPushNoti(push_usr)
        .then(function (res) {
          $state.go('tab.new');
        });
    }
    $scope.credentials = {}

    $scope.doLogIn = function (credentials) {
      var login = {
        username: credentials.username,
        password: credentials.password
      }
      AuthService.loginUser(login)
        .then(function (response) {
          console.log(response);
          // alert('then');
          if (response["message"]) {
            $scope.credentials = {}
            //alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            var alertPopup = $ionicPopup.alert({
              title: 'แจ้งเตือน',
              template: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
            });

            alertPopup.then(function (res) {
              console.log('Invalid username or password');
            });

          }
          else {
            if (response.roles[0] === 'deliver') {
              var push_usr = {
                user_id: response._id,
                user_name: response.username,
                role: 'deliver',
                device_token: JSON.parse(window.localStorage.token || null)
              };
              AuthService.saveUserPushNoti(push_usr)
                .then(function (res) {
                  $scope.credentials = {}
                  $state.go('tab.new');
                });
              // alert('success');
            } else {
              //alert('คุณไม่มีสิทธิ์เข้าใช้งาน');
              var alertPopup = $ionicPopup.alert({
                title: 'แจ้งเตือน',
                template: 'คุณไม่มีสิทธิ์เข้าใช้งาน'
              });

              alertPopup.then(function (res) {
                console.log('คุณไม่มีสิทธิ์เข้าใช้งาน');
              });
            }
          }
        });
      // console.log("doing sign up");

    };
  })

  .controller('NewCtrl', function ($scope, $rootScope, $http, $state, AuthService, $stateParams) {
    $scope.btnGo = function (data) {

      console.log(data);
      $state.go('tab.newdetail', { data: JSON.stringify(data) });
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
          // alert('success');
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
          // alert('success');
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
      if ($rootScope.countOrder) {
        $rootScope.countOrder = $rootScope.countOrder;
      }
      $scope.orders = [];
      $rootScope.countOrder = 0;
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

          $rootScope.countOrder = $scope.orders.length;
          $rootScope.Order = $scope.orders;

          console.log($scope.orders);
        });
    }
  })

  .controller('MeCtrl', function ($scope, $http, $state, AuthService, $stateParams, $ionicPopup, $rootScope) {
    $scope.btnGo = function (data) {

      console.log(data);
      $state.go('tab.me-detail', { data: JSON.stringify(data) });
    }

    // $scope.showConfirm = function () {
    //   var confirmPopup = $ionicPopup.confirm({
    //     title: '',
    //     template: 'ต้องการอัพเดต'
    //   });
    //   confirmPopup.then(function (res) {
    //     if (res) {
    //       $scope.completeDeliver(res);
    //     } else {
    //       alert('Cancel');
    //     }
    //   });
    // };

    $scope.completeDeliver = function (item) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'แจ้งเตือน',
        template: 'คุณต้องการอัพเดตพิกัดนี้หรือไม่'
      });
      confirmPopup.then(function (res) {
        if (res) {
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
              // alert('อัพเดต');
              $scope.init();
            }, function (error) {
              console.log(error);
              alert('dont success' + " " + error.data.message);
            });

        } else {
          // alert('Cancel');
          $scope.init();
        }
      });



      // console.log(item);
    };
    $scope.init = function () {
      $scope.readOrder();
    }
    $scope.readOrder = function () {
      if ($rootScope.countOrderApt) {
        $rootScope.countOrderApt = $rootScope.countOrderApt;
      }
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
          $rootScope.countOrderApt = $scope.ordersApt.length;
          $rootScope.OrderApt = $scope.ordersApt;

          console.log($scope.ordersApt);
        });
    }
    $scope.doRefresh = function () {
      $scope.init();
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

    };
  })

  .controller('MeDetailCtrl', function ($scope, $stateParams) {
    console.log(JSON.parse($stateParams.data));
    $scope.data = JSON.parse($stateParams.data);
  })

  .controller('NewDetailCtrl', function ($scope, $stateParams) {
    console.log(JSON.parse($stateParams.data));
    $scope.data = JSON.parse($stateParams.data);
  })

  .controller('MapCtrl', function ($scope, $http, $state, AuthService, $stateParams, $cordovaGeolocation) {
    console.log('ok');

    var locations = [
      [13.9351084, 100.715099],
      [13.9341505, 100.7141161],
      [13.9347128, 100.7163853]
    ]

    var posOptions = { timeout: 10000, enableHighAccuracy: false };
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat = position.coords.latitude
        var long = position.coords.longitude
        // alert(lat + ':' + long);
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: new google.maps.LatLng(lat, long), //เปลี่ยนตามต้องการ
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        //////ตำแหน่งที่ mark ปัจจุบัน///////////
        var marker = new google.maps.Marker({
          position: map.getCenter(),
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: 'blue',
            fillOpacity: 0.2,
            strokeColor: 'blue',
            strokeWeight: 0
          },
          draggable: true,
          map: map
        });
        var marker = new google.maps.Marker({
          position: map.getCenter(),
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#1c90f3',
            fillOpacity: 0.5,
            strokeColor: 'white',
            strokeWeight: 1
          },
          draggable: true,
          map: map
        });

        for (var i = 0; i < locations.length; i++) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][0], locations[i][1]),
            map: map
          });
        }

        $scope.map = map;
      }, function (err) {
        // error
      });
  })

  .controller('MoreCtrl', function ($scope, $http, $state, AuthService, $stateParams, $ionicModal, ProductService, $ionicPopup, $rootScope) {
    $scope.userStore = AuthService.getUser();
    console.log($scope.userStore);
    $scope.products = [];
    ProductService.getProduct()
      .then(function (data) {
        var productlist = data;
        // $scope.products = productlist; 
        // console.log($scope.products); 
        productlist.forEach(function (pro) {
          var product = {
            product: pro,
            qty: pro.qty,
            amount: pro.amount
          }
          $scope.products.push(product);
          console.log($scope.products);
        });
      });
    $scope.init = function () {

      $scope.order =
        { items: [] };
      $scope.order.discountpromotion = 0;
      $scope.order.totalamount = 0;
      if ($scope.order.amount) {
        $scope.order.amount = $scope.order.amount;
      } else {
        $scope.order.amount = 0;
      }
      $scope.loadData();


    }
    $scope.calculate = function (item) {
      item.qty = item.qty || 0;
      item.amount = item.product.price * item.qty;
      $scope.order.items = $scope.products;
      $scope.sumary($scope.order.items);
    }
    $scope.sumary = function (order) {
      $scope.order.totalamount = 0;
      angular.forEach(order, function (prod) {
        $scope.order.totalamount += prod.amount || 0;
        console.log($scope.order.totalamount);
      });
      $scope.order.amount = $scope.order.totalamount + $scope.order.discountpromotion;

      var items = $scope.order.items;
      $scope.orders = { items: [] };
      // console.log($scope.order); 
      items.forEach(function (res) {
        if (res.qty && res.qty !== undefined) {
          $scope.orders.items.push(res);
        }
      });

      $scope.order.items = [];
      $scope.order.items = $scope.orders.items;
      console.log($scope.order);
    }
    $scope.addQty = function (item) {
      item.qty = item.qty || 0;
      item.qty += 1;
      $scope.calculate(item);

    }
    $scope.removeQty = function (item) {
      if (item.qty > 0) {
        item.qty = item.qty || 0;
        item.qty -= 1;
        $scope.calculate(item);
      }
    }
    $scope.saveOrder = function () {
      if (!$scope.order._id && $scope.userStore.roles[0] === 'deliver') {
        $scope.order = {
          docdate: new Date(),
          docno: (+ new Date()),

          historystatus: [{
            status: 'complete',
            datestatus: new Date()
          }],
          items: $scope.order.items,
          shipping: {
            firstname: $scope.userStore.firstName,
            lastname: $scope.userStore.lastName,
            address: $scope.userStore.address.address,
            postcode: $scope.userStore.address.postcode,
            subdistrict: $scope.userStore.address.subdistrict,
            province: $scope.userStore.address.province,
            district: $scope.userStore.address.district,
            tel: $scope.userStore.address.tel,
            email: $scope.userStore.email
          },
          delivery: {
            deliveryid: '0'
          },
          deliverystatus: 'complete',
          namedeliver: $scope.userStore,
          user: $scope.userStore,
          discountpromotion: $scope.order.discountpromotion,
          totalamount: $scope.order.totalamount,
          amount: $scope.order.amount
        }
      }
      console.log($scope.order);
      ProductService.postOrder($scope.order)
        .then(function (response) {
          $scope.modal.hide();
          $scope.init();
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });
    }
    $scope.showConfirm = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'สรุปรายการสั่งซื้อ',
        template: 'รวมราคา :' + ' ' + $scope.order.amount + '<br/>'
        + 'ส่วนลด :' + ' ' + $scope.order.discountpromotion + '<br/>'
        + 'รวมสุทธิ :' + ' ' + $scope.order.totalamount,

      });

      confirmPopup.then(function (res) {
        if (res) {
          $scope.saveOrder();
        } else {
          // console.log('Not sure!');
        }
      });

    };

    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.doLogOut = function () {
      AuthService.signOut();
      $state.go('authen');
    };

    $scope.listbl = function () {
      $state.go('listbl');
    };
    $scope.loadData = function () {


      AuthService.getOrder()
        .then(function (data) {
          var userStore = AuthService.getUser();
          var orderlist = data;
          $scope.ordersComplete = [];
          angular.forEach(orderlist, function (user) {
            if (user.namedeliver) {
              if (user.user._id === user.namedeliver._id) {
                $scope.ordersComplete.push(user);
              }
            }
            // console.log($scope.ordersComplete);
            $rootScope.OrdersCpt = $scope.ordersComplete;
          })
        });
    }
    $scope.doRefresh = function () {
      $scope.init();

      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

    };
    $scope.btnGo = function (data) {

      console.log(data);
      $state.go('tab.me-detail', { data: JSON.stringify(data) });
    }
  });
