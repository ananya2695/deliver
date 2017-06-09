deliverApp.controller('MoreCtrl', function ($scope, $http, $state, config, AuthService, $stateParams, $cordovaGeolocation, $ionicModal, ProductService, $ionicPopup, $rootScope, RequestService, ReturnService, AccuralService, StockService, $ionicSideMenuDelegate, $cordovaImagePicker, $cordovaFileTransfer, $ionicLoading, $timeout) {
  $scope.$on('$ionicView.enter', function () {
    $ionicSideMenuDelegate.canDragContent(true);
  });
  $scope.userStore = AuthService.getUser();
  $scope.apiUrl = config.apiUrl;
  $scope.limitTo = 0;
  $scope.leftMoreBl = 0;
  $scope.showInfiniteBl = true;
  $scope.Platform = window.localStorage.adminplatform;
  // alert('more mai?');
  $scope.updateDeliver = false;

  $scope.loadMoreBl = function (orders) {
    $scope.$broadcast('scroll.refreshComplete');
    $scope.$broadcast('scroll.infiniteScrollComplete');
    if (orders.length > 0) {
      $scope.limitTo += 20;
      $scope.leftMoreBl -= 20;

      if ($scope.leftMoreBl <= 0) {
        $scope.showInfiniteBl = false;
      } else {
        $scope.showInfiniteBl = true;
      }
    }
  };

  $scope.filter = function (filter, orders) {
    if (filter.length > 4) {
      $scope.limitTo = orders.length;
      $scope.filterText = filter;
      $scope.showInfiniteBl = false;
    } else {
      $scope.limitTo = 20;
      $scope.filterText = "";
      $scope.showInfiniteBl = true;
    }
  }

  $scope.updateProfileDeli = function (user) {
    var userX = $scope.userStore
    userX = {
      address: {
        address: user.address.address ? userX.address.address : ' ',
        district: user.address.district ? userX.address.district : ' ',
        subdistrict: user.address.subdistrict ? userX.address.subdistrict : ' ',
        province: user.address.province ? userX.address.province : ' ',
        postcode: user.address.postcode ? userX.address.postcode : ' ',
        tel: user.address.tel ? userX.address.tel : ' ',
        sharelocation: {
          latitude: user.address.sharelocation.latitude ? userX.address.sharelocation.latitude : ' ',
          longitude: user.address.sharelocation.longitude ? userX.address.sharelocation.longitude : ' '
        }
      },
      email: user.email ? userX.email : ' ',
    }
    // console.log(userX);
    AuthService.updateUser(userX)
      .then(function (response) {
        alert('อัพเดตเสร็จสมบูรณ์');
        var data = response.data;
        window.localStorage.setItem("user", JSON.stringify(data));
        $scope.userStore = AuthService.getUser();
      }, function (error) {
        alert('dont success' + " " + error.data.message);
        $scope.userStore = AuthService.getUser();
      });
  };

  $scope.changeImageProfile = function () {
    var optionsImg = {
      maximumImagesCount: 1,
      width: 600,
      height: 600,
      quality: 80
    };

    var options = {
      fileKey: "newProfilePicture",
      httpMethod: "POST",
      michattype: "image/jpeg",
      chunkedMode: true
    };

    $cordovaImagePicker.getPictures(optionsImg)
      .then(function (results) {
        var user = AuthService.getUser();
        $cordovaFileTransfer.upload($scope.apiUrl + 'api/users/picture', results[0], options).then(function (result) {
          $scope.loggedUser = AuthService.updateImgUser(result.response);
          $state.go('app.tab.listdetail');
          $ionicLoading.hide();
          $scope.userStore = AuthService.getUser();
        }, function (err) {
          $ionicLoading.hide();
          alert("ERROR: " + JSON.stringify(err));
        }, function (progress) {
          $ionicLoading.show({ template: '<ion-spinner icon="android"></ion-spinner><p style="margin: 5px 0 0 0;">กำลังอัพโหลดรูปภาพ</p>' });
        });
      }, function (error) {
        alert("ERROR: " + JSON.stringify(error));
      });
  };

  $scope.CancelUpdate = function () {
    $scope.userStore = AuthService.getUser();
  };
  $scope.$on('onNotification', function (event, args) {
    $rootScope.getInitBadge();
    if ($state.current.name == 'app.listAr') {
      $scope.initAr();
    } else if ($state.current.name == 'app.listreceived') {
      $scope.initListReceived();
    } else if ($state.current.name == 'app.listReturn') {
      $scope.initReturn();
    };
  });
  // alert($scope.Platform);
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

  $scope.initBl = function () {
    // alert("initbl");
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

  $scope.initListReceived = function () {

    $scope.Request = true;
    $scope.Response = false;
    $scope.Received = false;
    $scope.requestorders();

  }

  $scope.initStock = function () {
    $scope.stocks();
  }

  $scope.initReturn = function () {
    $scope.Request = true;
    $scope.Response = false;
    $scope.Received = false;
    $scope.returnorders();
  }

  $scope.initAr = function () {
    $scope.Request = true;
    $scope.Response = false;
    $scope.Received = false;
    $scope.accuralreceipts();
  }

  $scope.doRefreshInitBl = function () {
    $scope.initBl();

    $scope.$broadcast('scroll.refreshComplete');
  };
  $scope.doRefreshInitListReceived = function () {
    $scope.initListReceived();

    $scope.$broadcast('scroll.refreshComplete');
  };
  $scope.doRefreshInitStock = function () {
    $scope.initStock();

    $scope.$broadcast('scroll.refreshComplete');
  };
  $scope.doRefreshInitReturn = function () {
    $scope.initReturn();

    $scope.$broadcast('scroll.refreshComplete');
  };
  $scope.doRefreshInitAr = function () {
    $scope.initAr();

    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.initProfile = function () {
    $scope.mapdetail();
    $scope.centerOnMe();
  };
  // $scope.init = function () {

  //   $scope.loadData();
  //   $scope.mapdetail();
  //   // $scope.requestorders();
  //   // $scope.returnorders();
  //   // $scope.accuralreceipts();
  //   // $scope.stocks();
  //   $scope.centerOnMe();
  // }

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
    $ionicLoading.show({ template: 'กรุณารอสักครู่' });

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
        $scope.initBl();

      }, function (error) {
        $ionicLoading.hide();
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

  $scope.detailreceived = function () {
    $state.go('app.detailreceived');
  };

  $scope.listdetail = function () {
    $state.go('app.listdetail');
  };

  $scope.detailreturn = function () {
    $state.go('app.detailreturn');
  };


  $scope.detailAr = function () {
    $state.go('app.detailAr');
  };

  $scope.loadData = function () {
    // alert('more');
    $rootScope.readOrder();
    // if ($rootScope.ordersComplete.length > 0) {
    //   $rootScope.ordersComplete.forEach(function (order) {
    //     if (order.namedeliver && $scope.userStore && order.namedeliver._id === $scope.userStore._id) {
    //       $rootScope.OrdersCpt.push(order);
    //     }
    //   });
    // }


  }
  $rootScope.setDataBl = function () {
    $rootScope.OrdersCpt = [];
    $rootScope.OrdersCpt = $rootScope.ordersComplete;
    if ($rootScope.OrdersCpt.length > 20) {
      $scope.limitTo = 20;
      $scope.showInfiniteBl = true;
    } else {
      $scope.limitTo = $rootScope.OrdersCpt.length;
      $scope.showInfiniteBl = false;
    }
    $scope.leftMoreBl = $rootScope.OrdersCpt.length > 20 ? $rootScope.OrdersCpt.length - $scope.limitTo : 0;
    // alert($rootScope.OrdersCpt.length);
  }
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
                alert('ส่งตำแหน่งสำเร็จ');
              }, function (error) {
                alert('dont success' + " " + error.data.message);
              });
          }
        };
      }, function (err) {
        // error
      });
  }
  // init()
  $scope.centerOnMe = function () {
    var posOptions = { timeout: 10000, enableHighAccuracy: false };
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat = position.coords.latitude
        var long = position.coords.longitude
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: new google.maps.LatLng(lat, long), //เปลี่ยนตามต้องการ
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        $scope.map = map;
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
      }, function (err) {
      });

  };

  $scope.requestorders = function () {
    $ionicLoading.show({ template: 'กรุณารอสักครู่' });
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

        if ($scope.listRequest) {
          $rootScope.countlistRequest = $scope.listRequest.length;
        }
        if ($scope.listResponse) {
          $rootScope.countlistResponse = $scope.listResponse.length;
        }
        if ($scope.listReceived) {
          $rootScope.countlistReceived = $scope.listReceived.length;
        }

        $rootScope.countlistreceiveds = $scope.listRequest.length + $scope.listReceived.length + $scope.listRequest.length;

        // console.log($scope.listRequest.length);
        // console.log($scope.listResponse.length);
        // console.log($scope.listReceived.length);
        $ionicLoading.hide();
      });
  }

  $scope.returnorders = function () {
    $ionicLoading.show({ template: 'กรุณารอสักครู่' });
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
        if ($scope.listReturns) {
          $rootScope.countlistReturns = $scope.listReturns.length;
        }
        if ($scope.listreturnResponse) {
          $rootScope.countlistreturnResponse = $scope.listreturnResponse.length;
        }
        if ($scope.listreturnReceived) {
          $rootScope.countlistreturnReceived = $scope.listreturnReceived.length;
        }

        $rootScope.countlistReturned = $scope.listreturnReceived.length + $scope.listreturnResponse.length + $scope.listReturns.length;
        $ionicLoading.hide();
      });

  }

  $scope.accuralreceipts = function () {
    $ionicLoading.show({ template: 'กรุณารอสักครู่' });
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

        if ($scope.listarWait) {
          $rootScope.countlistarWait = $scope.listarWait.length;
        }
        if ($scope.listarConfirmed) {
          $rootScope.countlistarConfirmed = $scope.listarConfirmed.length;
        }
        if ($scope.listarReceipt) {
          $rootScope.countlistarReceipt = $scope.listarReceipt.length;
        }

        $rootScope.countlistAr = $scope.listarReceipt.length + $scope.listarConfirmed.length + $scope.listarWait.length;
        $ionicLoading.hide();
      });
  }

  $scope.stocks = function () {
    $ionicLoading.show({ template: 'กรุณารอสักครู่' });
    StockService.getStocks()
      .then(function (data) {
        $scope.stockdeli = [];
        data.forEach(function (stock) {
          if (stock.namedeliver && $scope.userStore._id === stock.namedeliver._id) {
            $scope.stockdeli.push(stock);
            $rootScope.countStock = stock.stocks.length;
          }
        });
        $ionicLoading.hide();
      });
  }

})