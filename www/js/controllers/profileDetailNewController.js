deliverApp.controller('ProfileDetailNewCtrl', function ($scope, $state, $stateParams, AuthService, $ionicSideMenuDelegate, Socket, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.data = JSON.parse($stateParams.data);
    $scope.userStore = AuthService.getUser();

    $scope.tel = function (telnumber) {
      var reNumber = '';
      var regex = /(\d+)/g;
      var reNum = telnumber.match(regex);
      reNum.forEach(function (item) {
        reNumber += item
      });
      // alert(reNumber);
      window.location = 'tel:' + reNumber;
    };


    $rootScope.chattype = 'ProNew';
    $scope.gotoChat4 = function (user) {
      if ($rootScope.chattype === 'normal' || $rootScope.chattype === 'New') {
        $rootScope.chattype = 'ProNew';
      } else {
        $rootScope.chattype = 'ProNew';
      }
      // alert($rootScope.chattype);
      // console.log('MeDetailCtrl' + user.username);
      var data = {
        name: $scope.userStore.username + '' + user.username,
        type: 'P',
        users: [$scope.userStore, user],
        user: $scope.userStore
      };
      Socket.emit('createroom', data);
      // Add an event listener to the 'invite' event
      Socket.on('invite', function (res) {
        // console.log('invite ConfirmedCtrl');
        // alert('invite : ' + JSON.stringify(res));
        Socket.emit('join', res);
      });

      // Add an event listener to the 'joinsuccess' event
      Socket.on('joinsuccess', function (data) {
        // console.log('joinsuccess ConfirmedCtrl');
        // alert('joinsuccess : ' + JSON.stringify(data));
        $scope.room = data;
        if ($rootScope.chattype === 'ProNew') {
          $state.go('app.tab.chat-detailpronew', { chatId: data._id });
        }
        // alert('มาจากโปรไฟล์');

        // $scope.pageDown();
        // alert('joinsuccess : ' + JSON.stringify(data));
      });
    }

  })