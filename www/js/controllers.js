angular.module('starter.controllers', [])

  .controller('LogInCtrl', function ($scope, $state, AuthService, $ionicPopup, $rootScope, $ionicLoading) {
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
      $ionicLoading.show({ template: 'กรุณารอสักครู่' });
      var push_usr = {
        user_id: $scope.userStore._id,
        user_name: $scope.userStore.username,
        role: 'deliver',
        device_token: JSON.parse(window.localStorage.token || null)
      };
      AuthService.saveUserPushNoti(push_usr)
        .then(function (res) {
          $ionicLoading.hide();
          $state.go('app.tab.new');

        });
    }
    $scope.credentials = {}

    $rootScope.$on('userLoggedIn', function (e, response) {
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
            // $rootScope.$broadcast('loading:hide');
            $ionicLoading.hide();
          });
      } else {
        alert('คุณไม่มีสิทธิ์เข้าใช้งาน');

      }

    });
    $rootScope.$on('userLoggedInerr', function (e, response) {
      if (response["message"]) {
        // $scope.credentials = {}
        $scope.credentials.password = '';
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        // $rootScope.$broadcast('loading:hide');
        // var alertPopup = $ionicPopup.alert({
        //   title: 'แจ้งเตือน',
        //   template: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        // });

        // alertPopup.then(function (res) {
        //   console.log('Invalid username or password');
        // });

      }
      $ionicLoading.hide();
      // console.log(error);
    });
    $rootScope.$on('userResume', function (e, response) {
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
            $rootScope.$broadcast('loading:hide');
          });
      } else {
        alert('คุณไม่มีสิทธิ์เข้าใช้งาน');
      }
    });

    $scope.doLogIn = function (credentials) {
      window.localStorage.credential = JSON.stringify(credentials);
      var login = {
        username: credentials.username,
        password: credentials.password
      }
      $ionicLoading.show({ template: 'กรุณารอสักครู่' });
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
























