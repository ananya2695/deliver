deliverApp.controller('NewDetailCtrl', function ($scope, $state, $stateParams, AuthService, $ionicSideMenuDelegate, $rootScope, $ionicLoading, $ionicModal) {
  $scope.$on('$ionicView.enter', function () {
    $ionicSideMenuDelegate.canDragContent(true);
  });
  $scope.userStore = AuthService.getUser();

  $scope.tels = function (telnumber) {
    var reNumber = '';
    var regex = /(\d+)/g;
    var reNum = telnumber.match(regex);
    reNum.forEach(function (item) {
      reNumber += item
    });
    // alert(reNumber);
    window.location = 'tel:' + reNumber;
    // window.location = 'tel:' + '0' + telnumber;
  };

  $scope.openMap = function (data) {
    // console.log(data);
    // var address = data.street + ", " + data.city + ", " + data.state;
    $scope.Platform = window.localStorage.adminplatform;
    var address = data.shipping.sharelocation.latitude + ", " + data.shipping.sharelocation.longitude;
    var text = data.shipping.address + ' ' + data.shipping.district + ' ' + data.shipping.subdistrict + ' ' + data.shipping.province + ' ' + data.shipping.postcode;
    var url = '';
    if ($scope.Platform === 'iOS' || $scope.Platform === 'iPhone') {
      url = "http://maps.apple.com/maps?q=" + encodeURIComponent(text + ',' + address);
    } else if ($scope.Platform === 'Android' || $scope.Platform === 'IEMobile' || $scope.Platform === 'BlackBerry') {
      url = "geo:?q=" + encodeURIComponent(text + ',' + address);
    } else {
      //this will be used for browsers if we ever want to convert to a website
      url = "http://maps.google.com?q=" + encodeURIComponent(text + ',' + address);
      // url = "http://maps.google.com?q=" + 'สยามพารากอน' +',' +'13.7461473' + ',' + '100.5323265';
    }
    window.open(url, "_system", 'location=yes');
    // window.open("http://maps.apple.com/?q=#{text}&ll=#{lat},#{long}&near=#{lat},#{long}", '_system', 'location=yes')
    // window.open("geo:#{lat},#{long}?q=#{text}", '_system', 'location=yes')
  };
  // console.log(JSON.parse($stateParams.data));
  $scope.data = JSON.parse($stateParams.data);
  $scope.setItem = function () {
    window.localStorage.point = $stateParams.data;
  }
  $scope.acceptDeliver = function (item) {
    $ionicLoading.show({ template: 'กรุณารอสักครู่' });
    var listApt =
      {
        status: 'accept',
        datestatus: new Date()
      };
    item.historystatus.push(listApt);

    var status = item.deliverystatus;
    status = 'accept';
    var order = {};
    if (item.namedeliver) {
      order = {
        deliverystatus: status,
        historystatus: item.historystatus
      }
    } else {
      order = {
        deliverystatus: status,
        historystatus: item.historystatus,
        namedeliver: $scope.userStore
      }
    }

    var orderId = item._id;

    AuthService.updateOrder(orderId, order)
      .then(function (response) {
        //alert('success');
        //$scope.init();
        $state.go('app.tab.new');
        $rootScope.readOrder();
        // $rootScope.$broadcast('onAccept');
      }, function (error) {
        console.log(error);
        $ionicLoading.hide();
        if (error.data.message == "order is already accept") {
          alert('รายการนี้มีผู้รับแล้ว');
          $state.go('app.tab.new');
        } else {
          console.log(error);
          alert('dont success' + " " + error.data.message);
        }
        //alert('dont success' + " " + error.data.message);
      });


  };

  $scope.rejectDeliver = function (item) {
    var remark = prompt("กรุณากรอกเหตุผล", "");

    if (remark == "") {
      console.log('error reject');
      alert('กรุณากรอกเหตุผล');
    } else if (remark == null) {
      console.log('cancel reject');
    } else {
      // alert(remark);

      $ionicLoading.show({ template: 'กรุณารอสักครู่' });
      var namedeli = item.namedeliver;
      namedeli = null;
      var status = item.deliverystatus;
      status = 'reject';
      var listApt = {
        status: 'reject',
        datestatus: new Date(),
        remark: remark,
        delivername: $scope.userStore.displayName
      }
      item.historystatus.push(listApt);
      var order = {
        namedeliver: null,
        deliverystatus: status,
        historystatus: item.historystatus
      }
      var orderId = item._id;
      AuthService.updateOrder(orderId, order)
        .then(function (response) {
          // alert('success');
          $state.go('app.tab.new');
          $ionicLoading.hide();

        }, function (error) {
          $ionicLoading.hide();
          console.log(error);
          alert('dont success' + " " + error.data.message);
        });
    }

  };

  $scope.gotohistory= function(){
    alert('ok');
  };

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.btnGoDetail = function (data) {
    console.log(data);
    $state.go('app.tab.profile-detailnew', { data: JSON.stringify(data) });
  };
  // $rootScope.chattype = 'New';
  // $scope.gotoChat = function (user) {
  //   if ($rootScope.chattype === 'normal' || $rootScope.chattype === 'Me') {
  //     $rootScope.chattype = 'New';
  //   } else {
  //     $rootScope.chattype = 'New';
  //   }
  //   // console.log('NewDetailCtrl' + user.username);
  //   var data = {
  //     name: $scope.userStore.username + '' + user.username,
  //     type: 'P',
  //     users: [$scope.userStore, user],
  //     user: $scope.userStore
  //   };
  //   Socket.emit('createroom', data);
  //   // Add an event listener to the 'invite' event
  //   Socket.on('invite', function (res) {
  //     // console.log('invite ConfirmedCtrl');
  //     // alert('invite : ' + JSON.stringify(res));
  //     Socket.emit('join', res);
  //   });

  //   // Add an event listener to the 'joinsuccess' event
  //   Socket.on('joinsuccess', function (data) {
  //     // console.log('joinsuccess ConfirmedCtrl');
  //     // alert('joinsuccess : ' + JSON.stringify(data));
  //     $scope.room = data;
  //     if ($rootScope.chattype === 'New') {
  //       $state.go('app.tab.chat-detailNew', { chatId: data._id });
  //     }
  //     // $scope.pageDown();
  //     // alert('joinsuccess : ' + JSON.stringify(data));
  //   });
  // }
})