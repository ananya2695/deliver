deliverApp.controller('ChatCtrl', function ($scope, $state, $ionicModal, AuthService, $rootScope, roomService, Socket, $ionicSideMenuDelegate, $ionicLoading) {
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.user = AuthService.getUser();
    //  alert(JSON.stringify($scope.user));
    $scope.listRoom = function () {
      $ionicLoading.show({ template: 'กรุณารอสักครู่' });
      roomService.getrooms().then(function (res) {
        // alert(JSON.stringify(res));
        $scope.chats = res;
        $ionicLoading.hide();
      }, function (err) {
        // alert(JSON.stringify(err));
        $ionicLoading.hide();
        console.log(err);
      });
    };
    $scope.listRoom();
    $scope.createRoom = function (data) {
      $ionicLoading.show({ template: 'กรุณารอสักครู่' });
      roomService.createRoom(data).then(function (res) {
        $scope.listRoom();
        $ionicLoading.hide();
      }, function (err) {
        $ionicLoading.hide();
        console.log(err);
      });
    };

    Socket.on('invite', function (res) {
      $scope.listRoom();
    });

  })