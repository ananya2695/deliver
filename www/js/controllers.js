angular.module('starter.controllers', [])

  .controller('LogInCtrl', function ($scope, $state, AuthService, $ionicPopup, $rootScope) {
    var push = new Ionic.Push({
      "debug": true,
      "onNotification": function (notification) {
        console.log(notification);
        $rootScope.$broadcast('onNotification');
        if (notification._raw.additionalData.foreground) {
          //   //alert(notification.message);

          $rootScope.$broadcast('onNotification');
        }
      }
    });

    push.register(function (token) {
      console.log("My Device token:", token.token);
      // prompt('copy token', token.token);
      window.localStorage.token = JSON.stringify(token.token);
      push.saveToken(token);  // persist the token in the Ionic Platform
    });

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
          $state.go('app.tab.new');
        });
    }
    $scope.credentials = {}

    $rootScope.$on('userLoggedIn', function (e, response) {
      // console.log(response);
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
            $state.go('app.tab.new');
            $rootScope.$broadcast('onLoginSuccess');
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
    });
    $rootScope.$on('userLoggedInerr', function (e, response) {
      console.log(response);
      if (response["message"]) {
        $scope.credentials = {}
        //alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        $rootScope.$broadcast('loading:hide')
        var alertPopup = $ionicPopup.alert({
          title: 'แจ้งเตือน',
          template: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        });

        alertPopup.then(function (res) {
          console.log('Invalid username or password');
        });

      }
      // console.log(error);
    });

    $scope.doLogIn = function (credentials) {
      window.localStorage.credential = JSON.stringify(credentials);
      var login = {
        username: credentials.username,
        password: credentials.password
      }
      AuthService.loginUser(login);
      //   .then(function (response) {
      //   console.log(response);
      //   // alert('then');
      //   if (response["message"]) {
      //     $scope.credentials = {}
      //     //alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      //     var alertPopup = $ionicPopup.alert({
      //       title: 'แจ้งเตือน',
      //       template: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      //     });

      //     alertPopup.then(function (res) {
      //       console.log('Invalid username or password');
      //     });

      //   }
      //   else {
      //     if (response.roles[0] === 'deliver') {
      //       var push_usr = {
      //         user_id: response._id,
      //         user_name: response.username,
      //         role: 'deliver',
      //         device_token: JSON.parse(window.localStorage.token || null)
      //       };
      //       AuthService.saveUserPushNoti(push_usr)
      //         .then(function (res) {
      //           $scope.credentials = {}
      //           $state.go('app.tab.new');
      //           $rootScope.$broadcast('onLoginSuccess');
      //         });
      //       // alert('success');
      //     } else {
      //       //alert('คุณไม่มีสิทธิ์เข้าใช้งาน');
      //       var alertPopup = $ionicPopup.alert({
      //         title: 'แจ้งเตือน',
      //         template: 'คุณไม่มีสิทธิ์เข้าใช้งาน'
      //       });

      //       alertPopup.then(function (res) {
      //         console.log('คุณไม่มีสิทธิ์เข้าใช้งาน');
      //       });
      //     }
      //   }
      // });
      // console.log("doing sign up");

    };
  })

  .controller('NewCtrl', function ($scope, $rootScope, $http, $state, AuthService, $stateParams) {

    $scope.btnGo = function (data) {

      console.log(data);
      $state.go('app.tab.newdetail', { data: JSON.stringify(data) });
    }

    var orderId = $stateParams.orderId;
    // console.log(orderId);
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
    $scope.doRefresh = function () {
      $scope.init();

      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

    };
    $scope.readOrder = function () {
      // if ($rootScope.countOrder) {
      //   $rootScope.countOrder = $rootScope.countOrder;
      // }
      // if ($rootScope.countOrderApt) {
      //   $rootScope.countOrderApt = $rootScope.countOrderApt;
      // }

      //$rootScope.countOrder = 0;
      AuthService.getOrder()
        .then(function (data) {

          var userStore = AuthService.getUser();
          var orderlist = data;
          $scope.orders = [];
          $scope.ordersApt = [];
          angular.forEach(orderlist, function (user) {

            if (user.namedeliver) {

              if (user.namedeliver._id === userStore._id) {

                if (user.deliverystatus === 'confirmed' || user.deliverystatus === 'wait deliver') {
                  $scope.orders.push(user);
                } else if (user.deliverystatus === 'accept') {
                  $scope.ordersApt.push(user);
                }

              }
            }

          })


          if ($scope.orders) {
            $rootScope.countOrder = $scope.orders.length;
          }
          if ($scope.ordersApt) {
            $rootScope.countOrderApt = $scope.ordersApt.length;
          }

          //console.log($scope.orders);


        });
    }
    $scope.$on('onNotification', function (event, args) {
      // do what you want to do
      //alert();
      $scope.init();
    });
    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
      // alert('ok');
      $scope.init();
    });

    $scope.btnGo2 = function (data) {

      console.log(data);
      $state.go('app.tab.me-detail', { data: JSON.stringify(data) });
    }
  })

  .controller('MeDetailCtrl', function ($scope, $state, $stateParams, AuthService, $ionicPopup, $cordovaGeolocation) {
    $scope.btnGoDetail = function (data) {
      console.log(data);
      $state.go('app.tab.profile-detail', { data: JSON.stringify(data) });
    };
    console.log(JSON.parse($stateParams.data));
    $scope.data = JSON.parse($stateParams.data);
    $scope.setItem = function () {
      window.localStorage.point = $stateParams.data;
    }
    $scope.completeDeliver = function (item) {
      // var confirmPopup = $ionicPopup.confirm({
      //   title: 'แจ้งเตือน',
      //   template: 'คุณต้องการอัพเดตพิกัดนี้หรือไม่',
      // });
      // confirmPopup.then(function (res) {
      // if (res) {
      //   var posOptions = { timeout: 10000, enableHighAccuracy: false };

      //   $cordovaGeolocation
      //     .getCurrentPosition(posOptions)
      //     .then(function (position) {

      //       var lat = position.coords.latitude
      //       var long = position.coords.longitude
      //       // 
      //       // alert(lat + '\n' + long);
      //       // var map = new google.maps.Map(document.getElementById('map'), {
      //       //   zoom: 15,
      //       //   center: new google.maps.LatLng(lat, long),
      //       //   mapTypeId: google.maps.MapTypeId.ROADMAP
      //       // });
      //       // $scope.map = map;

      //       var location = {
      //         latitude: lat,
      //         longitude: long
      //       }
      //       var status = item.deliverystatus;
      //       status = 'complete';
      //       var listApt = {
      //         status: 'complete',
      //         datestatus: new Date()
      //       }
      //       item.historystatus.push(listApt);
      //       var order = {
      //         deliverystatus: status,
      //         historystatus: item.historystatus,
      //         shipping: {
      //           sharelocation: location,
      //           tel: item.shipping.tel,
      //           email: item.shipping.email,
      //           firstname: item.shipping.firstname,
      //           lastname: item.shipping.lastname,
      //           address: item.shipping.address,
      //           postcode: item.shipping.postcode,
      //           subdistrict: item.shipping.subdistrict,
      //           province: item.shipping.province,
      //           district: item.shipping.district
      //         }
      //       }
      //       var orderId = item._id;

      //       AuthService.updateOrder(orderId, order)
      //         .then(function (response) {
      //           $state.go('app.tab.me');
      //           $rootScope.$broadcast('onComplete');
      //         }, function (error) {
      //           console.log(error);
      //           alert('dont success' + " " + error.data.message);
      //         });

      //     }, function (err) {
      //     });


      // } else {
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
          $state.go('app.tab.me');
          $rootScope.$broadcast('onComplete');
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });
      $scope.init();
      // }
      // });
      // console.log(item);
    };

  })

  .controller('NewDetailCtrl', function ($scope, $state, $stateParams, AuthService) {
    console.log(JSON.parse($stateParams.data));
    $scope.data = JSON.parse($stateParams.data);
    $scope.setItem = function () {
      window.localStorage.point = $stateParams.data;
    }
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
          //alert('success');
          //$scope.init();
          $state.go('app.tab.new');
          $rootScope.$broadcast('onAccept');
        }, function (error) {
          console.log(error);
          //alert('dont success' + " " + error.data.message);
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
          //alert('success');
          //$scope.init();
          $state.go('app.tab.new');
          $rootScope.$broadcast('onReject');
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });

      // console.log(item);
    };
    $scope.btnGoDetail = function (data) {
      console.log(data);
      $state.go('app.tab.profile-detail', { data: JSON.stringify(data) });
    };
  })

  .controller('MapCtrl', function ($scope, $rootScope, $http, $state, AuthService, $stateParams, $cordovaGeolocation, $compile, $ionicLoading) {


    var lat = null;
    var long = null;
    var map;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    $scope.init = function () {
      $scope.readMap();
    }

    $scope.clearItem = function () {
      window.localStorage.removeItem("point");
      $state.go('app.tab.map');
    }
    // $scope.$on('onLoginSuccess', function (event, args) {
    //   // do what you want to do
    //   //alert();
    //   $scope.init();
    // });
    $scope.readMap = function () {
      // console.log('ok');
      $scope.locationOrders = [];
      $scope.locationOrdersApt = [];

      var posOptions = { timeout: 10000, enableHighAccuracy: false };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          lat = position.coords.latitude
          long = position.coords.longitude
          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: new google.maps.LatLng(lat, long), //เปลี่ยนตามต้องการ
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
          $scope.map = map;

          if (!window.localStorage.point || window.localStorage.point === "") {
            AuthService.getOrder()
              .then(function (data) {
                var userStore = AuthService.getUser();

                data.forEach(function (user) {

                  if (user.namedeliver) {

                    if (user.namedeliver._id === userStore._id) {

                      if (user.deliverystatus === 'wait deliver') {
                        $scope.locationOrders.push(user);
                      } else if (user.deliverystatus === 'accept') {
                        $scope.locationOrdersApt.push(user);
                      }

                    }
                  }

                });
                // alert(lat + ':' + long);

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

                $scope.locationOrders.forEach(function (locations) {
                  var product = '';
                  var price = null;
                  locations.items.forEach(function (pro) {
                    product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                  })
                  var contentString = $compile('<div>'
                    + '<label>' + locations.shipping.firstname + ' ' + locations.shipping.lastname + '</label><br>'
                    + '<p>' + locations.shipping.address + ' ' + locations.shipping.subdistrict + ' ' + locations.shipping.district + ' ' + locations.shipping.province + ' ' + locations.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + locations.shipping.tel + '">' + locations.shipping.tel + '</a>' + '</p>'
                    + '<p>' + product + '</p>'
                    + '<label>' + 'ราคารวม : ' + locations.amount + ' บาท' + '</label><br>'
                    + '<label>' + 'ค่าจัดส่ง : ' + locations.deliveryamount + ' บาท' + '</label><br>'
                    + '<label>' + 'ส่วนลด : ' + locations.discountpromotion + ' บาท' + '</label><br>'
                    + '<label>' + 'รวมสุทธิ : ' + locations.totalamount + ' บาท' + '</label>'
                    + '<button class="button button-block button-outline button-positive icon-left ion-ios-location" ng-click="pinDirection(' + locations.shipping.sharelocation.latitude + ',' + locations.shipping.sharelocation.longitude + ')"> ค้นหาเส้นทาง </button>'
                    + '</div>')($scope);
                  var location = locations.shipping.sharelocation;
                  // console.log($scope.locationConfirmed.length);
                  if (location) {
                    var marker = new google.maps.Marker({
                      icon: {
                        url: ' http://res.cloudinary.com/hflvlav04/image/upload/v1486371643/riwxnxtjdfjganurw46m.png',
                        scaledSize: new google.maps.Size(32, 51),
                        // The origin for this image is (0, 0). 
                        origin: new google.maps.Point(0, 0),
                        // The anchor for this image is the base of the flagpole at (0, 32). 
                        //anchor: new google.maps.Point(0, 32)
                      },
                      position: new google.maps.LatLng(location.latitude, location.longitude),
                      map: map
                    });

                    var infowindow = new google.maps.InfoWindow({
                      content: contentString[0]
                    });
                    marker.addListener('click', function () {
                      // console.log('click');
                      infowindow.open($scope.map, this);
                    });
                  }

                });

                $scope.locationOrdersApt.forEach(function (locations) {
                  var product = '';
                  var price = null;
                  locations.items.forEach(function (pro) {
                    product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                  })
                  var contentString = $compile('<div>'
                    + '<label>' + locations.shipping.firstname + ' ' + locations.shipping.lastname + '</label><br>'
                    + '<p>' + locations.shipping.address + ' ' + locations.shipping.subdistrict + ' ' + locations.shipping.district + ' ' + locations.shipping.province + ' ' + locations.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + locations.shipping.tel + '">' + locations.shipping.tel + '</a>' + '</p>'
                    + '<p>' + product + '</p>'
                    + '<label>' + 'ราคารวม : ' + locations.amount + ' บาท' + '</label><br>'
                    + '<label>' + 'ค่าจัดส่ง : ' + locations.deliveryamount + ' บาท' + '</label><br>'
                    + '<label>' + 'ส่วนลด : ' + locations.discountpromotion + ' บาท' + '</label><br>'
                    + '<label>' + 'รวมสุทธิ : ' + locations.totalamount + ' บาท' + '</label>'
                    + '<button class="button button-block button-outline button-positive icon-left ion-ios-location" ng-click="pinDirection(' + locations.shipping.sharelocation.latitude + ',' + locations.shipping.sharelocation.longitude + ')"> ค้นหาเส้นทาง </button>'
                    + '</div>')($scope);
                  // console.log(locations);
                  var location = locations.shipping.sharelocation;
                  // console.log(location);
                  // console.log($scope.locationConfirmed.length);
                  if (location) {
                    var marker = new google.maps.Marker({
                      icon: {
                        url: 'http://res.cloudinary.com/hflvlav04/image/upload/v1486371632/sj4niz8oykdqfadnwhbo.png',
                        scaledSize: new google.maps.Size(28, 45),
                        // The origin for this image is (0, 0). 
                        origin: new google.maps.Point(0, 0),
                        // The anchor for this image is the base of the flagpole at (0, 32). 
                        // anchor: new google.maps.Point(0, 32)
                      },
                      position: new google.maps.LatLng(location.latitude, location.longitude),
                      map: map
                    });
                    var infowindow = new google.maps.InfoWindow({
                      content: contentString[0]
                    });
                    marker.addListener('click', function () {
                      console.log('click');
                      infowindow.open($scope.map, this);
                    });
                  }
                });
              }, function (err) {
                $rootScope.$broadcast('loading:hide');
                alert(JSON.stringify(err));
              });
          } else {
            var pointStart = {
              lat: parseFloat(lat),
              lng: parseFloat(long)
            }
            $scope.calcRoute(pointStart);
          }

        }, function (err) {
          // error
        });
    }
    
    $scope.calcRoute = function (pointStart) {
      var item = JSON.parse(window.localStorage.point);
      if (item) {
        var pointEnd = {
          lat: parseFloat(item.shipping.sharelocation.latitude),
          lng: parseFloat(item.shipping.sharelocation.longitude)
        }
        var routePoints = {
          start: { lat: pointStart.lat, lng: pointStart.lng },
          end: { lat: pointEnd.lat, lng: pointEnd.lng }
        }
        directionsDisplay.setDirections({ routes: [] });
        directionsDisplay.setMap($scope.map);

        var start = routePoints.start;
        var end = routePoints.end;
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
      }

      window.localStorage.removeItem("point");
      return;

    }

    $scope.pinDirection = function (lati, lngi) {
      var routePoints = {
        start: { lat: lat, lng: long },
        end: { lat: parseFloat(lati), lng: parseFloat(lngi) }
      }

      directionsDisplay.setDirections({ routes: [] });
      directionsDisplay.setMap($scope.map);

      var start = routePoints.start;
      var end = routePoints.end;
      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };
      directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });
    }

  })

  .controller('MoreDetailCtrl', function ($scope, $state, $stateParams, ProductService, $ionicPopup, $rootScope, RequestService, ReturnService, AccuralService) {
    console.log(JSON.parse($stateParams.data));
    $scope.data = JSON.parse($stateParams.data);

    $scope.showConfirm = function (data) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'คุณต้องการลบข้อมูลรายการสินค้านี้ใช่หรือไม่'
      });

      confirmPopup.then(function (res) {
        if (res) {
          $scope.deleteOrder(data);
        } else {
          // console.log('Not sure!');
        }
      });
    };

    $scope.deleteOrder = function (data) {
      ProductService.deleteOrder(data._id)
        .then(function (response) {
          $state.go('app.listbl');
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });
    }
    $scope.deliReceived = function (item) {
      var res = null;
      var listrcv =
        {
          status: 'received',
          datestatus: new Date()
        };
      item.historystatus.push(listrcv);

      var status = item.deliverystatus;
      status = 'received';
      var requestorder = {
        deliverystatus: status,
        historystatus: item.historystatus
      }
      var requestorderId = item._id;


      RequestService.updateRequestOrder(requestorderId, requestorder)
        .then(function (response) {
          // alert('success');
          $state.go('app.s');
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });
    };


    $scope.deliReturn = function (item) {
      var listrcv =
        {
          status: 'return',
          datestatus: new Date()
        };
      item.historystatus.push(listrcv);

      var status = item.deliverystatus;
      status = 'return';
      var returnorder = {
        deliverystatus: status,
        historystatus: item.historystatus
      }
      var returnordersId = item._id;


      ReturnService.updateReturnOrder(returnordersId, returnorder)
        .then(function (response) {
          // alert('success');
          $state.go('app.listReturn');
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });

    };

    $scope.deliAccural = function (item) {
      var listrcv =
        {
          status: 'confirmed',
          datestatus: new Date()
        };
      item.historystatus.push(listrcv);

      var status = item.deliverystatus;
      status = 'confirmed';
      var accuralreceipt = {
        arstatus: status,
        historystatus: item.historystatus
      }
      var accuralreceiptsId = item._id;


      AccuralService.updateAccuralOrder(accuralreceiptsId, accuralreceipt)
        .then(function (response) {
          $state.go('app.listAr');
        }, function (error) {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });

    };

  })

  .controller('MoreCtrl', function ($scope, $http, $state, AuthService, $stateParams, $cordovaGeolocation, $ionicModal, ProductService, $ionicPopup, $rootScope, RequestService, ReturnService, AccuralService, StockService) {
    $scope.userStore = AuthService.getUser();
    // console.log($scope.userStore);
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
          // console.log($scope.products);
        });
      });
    $scope.init = function () {
      $scope.Request = true;
      $scope.Response = false;
      $scope.Received = false;
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
      $scope.mapdetail();
      $scope.requestorders();
      $scope.returnorders();
      $scope.accuralreceipts();
      $scope.stocks();

    }
    $scope.$on('onLoginSuccess', function (event, args) {
      // do what you want to do
      $scope.init();
    });
    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
      // alert('ok');
      $scope.init();
    });
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
          $scope.products.forEach(function (prod) {
            prod.qty = 0;
            prod.amount = 0;
          });
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
      $state.go('app.listbl');
    };

    $scope.listreceived = function () {
      $state.go('app.listreceived');
    };
    $scope.detailreceived = function () {
      $state.go('app.detailreceived');
    };

    $scope.listdetail = function () {
      $state.go('app.listdetail');
    };

    $scope.listReturn = function () {
      $state.go('app.listReturn');
    };
    $scope.detailreturn = function () {
      $state.go('app.detailreturn');
    };

    $scope.listAr = function () {
      $state.go('app.listAr');
    };

    $scope.detailAr = function () {
      $state.go('app.detailAr');
    };
    $scope.liststock = function () {
      $state.go('app.liststock');
    };

    $scope.loadData = function () {


      AuthService.getOrder()
        .then(function (data) {
          var userStore = AuthService.getUser();
          var orderlist = data;
          $scope.ordersComplete = [];
          angular.forEach(orderlist, function (user) {
            if (user.namedeliver) {
              if (user.user) {

                if (user.user._id === user.namedeliver._id) {
                  if (userStore._id === user.namedeliver._id) {
                    $scope.ordersComplete.push(user);
                  }
                }
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
    $scope.goDetail = function (data) {
      $state.go('app.billdetail', { data: JSON.stringify(data) });
      console.log($stateParams.data);
    }

    $scope.requestOrderDetail = function (data) {
      $state.go('app.detailreceived', { data: JSON.stringify(data) });
      console.log($stateParams.data);
    }

    $scope.returnOrderDetail = function (data) {
      $state.go('app.detailreturn', { data: JSON.stringify(data) });
      console.log($stateParams.data);
    }

    $scope.accuralOrderDetail = function (data) {
      $state.go('app.detailAr', { data: JSON.stringify(data) });
      console.log($stateParams.data);
    }
    // 
    // 
    // console.log('detail map');
    $scope.mapdetail = function () {
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
              scale: 7,
              fillColor: '#4285f4',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 1
            },
            draggable: true,
            map: map
          });

          $scope.map = map;

          $scope.centerOnMe = function () {
            // alert('centerOnMe');
            if ($scope.map) {
              var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: new google.maps.LatLng(lat, long), //เปลี่ยนตามต้องการ
                mapTypeId: google.maps.MapTypeId.ROADMAP
              });
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
                  scale: 7,
                  fillColor: '#4285f4',
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 1
                },
                draggable: true,
                map: map
              });
            }
          };

          $scope.postme = function () {
            if ($scope.map) {
              var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: new google.maps.LatLng(lat, long), //เปลี่ยนตามต้องการ
                mapTypeId: google.maps.MapTypeId.ROADMAP
              });
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
                  scale: 7,
                  fillColor: '#4285f4',
                  fillOpacity: 1,
                  strokeColor: 'white',
                  strokeWeight: 1
                },
                draggable: true,
                map: map
              });
              // alert('lat : ' + lat + '\n' + 'long : ' + long);

              var userX = $scope.userStore
              userX = {
                address: {
                  postcode: userX.address.postcode,
                  district: userX.address.district,
                  subdistrict: userX.address.subdistrict,
                  province: userX.address.province,
                  address: userX.address.address,
                  tel: userX.address.tel,
                  sharelocation: {
                    latitude: lat,
                    longitude: long
                  }
                }
              }
              AuthService.updateUser(userX)
                .then(function (response) {
                  alert('เสร็จสมบูรณ์');
                }, function (error) {
                  alert('dont success' + " " + error.data.message);
                });
            }
          };
        }, function (err) {
          // error
        });
    }

    $scope.requestorders = function () {
      RequestService.getRequests()
        .then(function (data) {
          $scope.listRequest = [];
          $scope.listResponse = [];
          $scope.listReceived = [];
          data.forEach(function (request) {
            if ($scope.userStore._id === request.namedeliver._id) {
              if (request.deliverystatus === 'request') {
                $scope.listRequest.push(request);
              }
              else if (request.deliverystatus === 'response') {
                $scope.listResponse.push(request);
              }
              else if (request.deliverystatus === 'received') {
                $scope.listReceived.push(request);
              }
            }
          })
        });
    }

    $scope.returnorders = function () {
      ReturnService.getReturns()
        .then(function (data) {
          $scope.listReturns = [];
          $scope.listreturnResponse = [];
          $scope.listreturnReceived = [];
          data.forEach(function (ret) {
            if ($scope.userStore._id === ret.namedeliver._id) {
              if (ret.deliverystatus === 'return') {
                $scope.listReturns.push(ret);
              }
              else if (ret.deliverystatus === 'response') {
                $scope.listreturnResponse.push(ret);
              }
              else if (ret.deliverystatus === 'received') {
                $scope.listreturnReceived.push(ret);
              }
            }
          });

          // console.log($scope.listReturns.length);
          // console.log($scope.listreturnResponse.length);
          // console.log($scope.listreturnReceived.length);
        });
    }

    $scope.accuralreceipts = function () {
      AccuralService.getAccurals()
        .then(function (data) {
          $scope.listarWait = [];
          $scope.listarConfirmed = [];
          $scope.listarReceipt = [];
          data.forEach(function (ar) {
            if ($scope.userStore._id === ar.namedeliver._id) {
              if (ar.arstatus === 'wait for confirmed') {
                $scope.listarWait.push(ar);
              }
              else if (ar.arstatus === 'confirmed') {
                $scope.listarConfirmed.push(ar);
              }
              else if (ar.arstatus === 'receipt') {
                $scope.listarReceipt.push(ar);
              }
            }
          });

          // console.log($scope.listarWait.length);
          // console.log($scope.listarConfirmed.length);
          // console.log($scope.listarReceipt.length);
        });
    }

    $scope.stocks = function () {
      StockService.getStocks()
        .then(function (data) {
          $scope.stockdeli = [];
          data.forEach(function (stock) {
            if ($scope.userStore._id === stock.namedeliver._id) {
              $scope.stockdeli.push(stock);
            }
            // console.log($scope.stockdeli);
          });
        });
    }

  })

  .controller('ProfileDetailCtrl', function ($scope, $state, $stateParams, AuthService) {

    $scope.data = JSON.parse($stateParams.data);

    $scope.tel = function (telnumber) {
      // alert(telnumber);
      window.location = 'tel:' + '0' + telnumber;
    };

  })

  .controller('ChatCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, roomService, Socket) {

    $scope.user = AuthService.getUser();
    //  alert(JSON.stringify($scope.user));
    $scope.listRoom = function () {
      roomService.getrooms().then(function (res) {
        // alert(JSON.stringify(res));
        $scope.chats = res;
      }, function (err) {
        // alert(JSON.stringify(err));
        console.log(err);
      });
    };
    $scope.listRoom();
    $scope.createRoom = function (data) {
      roomService.createRoom(data).then(function (res) {
        $scope.listRoom();
      }, function (err) {
        console.log(err);
      });
    };

    Socket.on('invite', function (res) {
      $scope.listRoom();
    });

  })

  .controller('ChatDetailCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, roomService, $stateParams, Socket, $ionicScrollDelegate, $timeout) {
    $scope.user = AuthService.getUser();
    $scope.messages = [];
    $scope.chat = null;
    $scope.room = {};
    Socket.connect();
    // ทดสอบ mobile connect
    // Socket.on('mobile', function (message) {
    //   $scope.messages.unshift(message);
    // });
    $scope.loadRoom = function () {
      var roomId = $stateParams.chatId;
      roomService.getRoom(roomId).then(function (res) {
        res.users.forEach(function (user) {
          if ($scope.user._id != user._id) {
            $scope.title = user.displayName;
          }
        });
        $scope.chat = res;
        Socket.emit('join', $scope.chat);
      }, function (err) {
        console.log(err);
      });
    };

    // Add an event listener to the 'invite' event
    Socket.on('invite', function (res) {
      // alert('invite : ' + JSON.stringify(data));
      Socket.emit('join', res);
    });

    // Add an event listener to the 'joinsuccess' event
    Socket.on('joinsuccess', function (data) {
      $scope.room = data;
      $scope.pageDown();
      // alert('joinsuccess : ' + JSON.stringify(data));
    });

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (data) {
      // alert(JSON.stringify(data));
      $scope.room = data;
    });
    $scope.hideTime = true;
    var alternate,
      isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      // alternate = !alternate
      // if (!$scope.room.messages) {
      //     $scope.room.messages = [];
      $scope.room.messages.unshift({
        type: 'message',
        created: Date.now(),
        profileImageURL: $scope.user.profileImageURL,
        username: $scope.user.displayName,
        text: this.message
      });
      // } else {
      //     $scope.room.messages.unshift({
      //         type: 'message',
      //         created: Date.now(),
      //         profileImageURL: $scope.user.profileImageURL,
      //         username: $scope.user.username,
      //         text: this.message
      //     });
      // }
      $ionicScrollDelegate.scrollBottom(true);

      Socket.emit('chatMessage', $scope.room);
      this.message = '';
    };


    $scope.pageDown = function () {
      $timeout(function () {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);
    };







    // $scope.sendMessage = function () {
    //     alternate = !alternate;

    //     // var d = new Date();
    //     // d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    //     // $scope.room.messages.forEach(function(message){

    //     // });
    //     $scope.messages.push({
    //         userId: alternate ? '12345' : '54321',
    //         text: $scope.room.message,
    //         time: d
    //     });

    //     delete $scope.room.message;
    //     $ionicScrollDelegate.scrollBottom(true);

    // };

    $scope.inputUp = function () {
      // if (isIOS) $scope.room.keyboardHeight = 216;
      $timeout(function () {
        $ionicScrollDelegate.scrollBottom(true);
      }, 300);

    };

    $scope.inputDown = function () {
      // if (isIOS) $scope.room.keyboardHeight = 0;
      $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function () {
      // cordova.plugins.Keyboard.close();
    };


    $scope.data = {};
    $scope.myId = $scope.user.displayName;
  })

  .controller('FriendsCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, roomService, Socket) {
    $scope.user = AuthService.getUser();
    $scope.listAccount = function () {
      $scope.listRoom = [];
      $scope.friends = [];
      roomService.getrooms().then(function (rooms) {
        rooms.forEach(function (room) {
          room.users.forEach(function (user) {
            if ($scope.user._id === user._id) {
              $scope.listRoom.push(room);
            }
          });
        });
        if ($scope.listRoom.length > 0) {
          $scope.listRoom.forEach(function (room) {
            room.users.forEach(function (user) {
              if ($scope.user._id !== user._id) {
                $scope.friends.push(user);
              }
            });
          });
        }
        AuthService.getusers().then(function (accounts) {
          $scope.accounts = accounts;
        }, function (err) {
          console.log(err);
        });
      });
    };
    $scope.listAccount();
    $scope.addFriend = function (user) {
      var data = {
        name: $scope.user.username + '' + user.username,
        type: 'P',
        users: [$scope.user, user],
        user: $scope.user
      };
      Socket.emit('createroom', data);
    };
  });
