// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'angularMoment', 'satellizer', 'btford.socket-io'])
  .constant('config', {
    apiUrl: 'https://thamapptest.herokuapp.com/',
    redirectUri: 'http://localhost:8100/', // oauth callback url of ionic app example http://localhost:8100/
    facebook: {
      clientId: '414384685598077' // your client id from facebook console example 
    },
    //https://thamapp.herokuapp.com/      for production
    //https://thamapptest.herokuapp.com/  for heroku test
    //http://localhost:3000/              for local
  })
  .run(function ($ionicPlatform, AuthService) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      var devicePlatform = device.platform;
      window.localStorage.adminplatform = devicePlatform;

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      if (window.localStorage.credential) {
        var user = JSON.parse(window.localStorage.credential);
        AuthService.loginUser(user);
      }
    });
    $ionicPlatform.on("resume", function (event) {
      // user opened the app from the background
      if (window.localStorage.credential) {
        var user = JSON.parse(window.localStorage.credential);
        AuthService.loginUser(user);
      }
    });
  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope) {
      return {
        request: function (config) {
          $rootScope.$broadcast('loading:show')
          return config
        },
        response: function (response) {
          $rootScope.$broadcast('loading:hide')
          return response
        }
      }
    })
  })

  .run(function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function () {
      $ionicLoading.show({ template: 'กรุณารอสักครู่' })
    })

    $rootScope.$on('loading:hide', function () {
      $ionicLoading.hide()
    })
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom")
    //$authProvider
    // var commonConfig = {
    //   popupOptions: {
    //     location: 'no',
    //     toolbar: 'yes',
    //     width: window.screen.width,
    //     height: window.screen.height
    //   }
    // };

    // if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
    //   commonConfig.redirectUri = 'https://thamapp.herokuapp.com/';
    // }

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      // .state('tab', {
      //   url: '/tab',
      //   abstract: true,
      //   templateUrl: 'templates/tabs.html'
      // })

      //side menu
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MoreCtrl'
      })

      .state('app.tab', {
        url: "/tab",
        abstract: true,
        views: {
          'menuContent': {
            templateUrl: "templates/tabs.html",
          }
        }
      })
      // Each tab has its own nav history stack:

      .state('authen', {
        url: '/authen',
        templateUrl: 'templates/authentication.html',
        controller: 'LogInCtrl'
      })

      .state('app.tab.new', {
        url: '/new',
        views: {
          'tab-new': {
            templateUrl: 'templates/tab-new.html',
            controller: 'NewCtrl'
          }
        }
      })

      .state('app.tab.profile-detail', {
        url: '/profile-detail:{data}',
        views: {
          'tab-new': {
            templateUrl: 'templates/user-profile-detail.html',
            controller: 'ProfileDetailCtrl'
          }
        }
      })

      .state('app.tab.profile-detail2', {
        url: '/profile-detail:{data}',
        views: {
          'tab-me': {
            templateUrl: 'templates/user-profile-detail.html',
            controller: 'ProfileDetailCtrl'
          }
        }
      })

      .state('app.tab.chat', {
        url: "/chat",
        views: {
          'tab-chat': {
            templateUrl: "templates/tab-chat.html",
            controller: 'ChatCtrl'
          }
        }
      })

      .state('app.tab.chat-detail', {
        url: "/chat/:chatId",
        views: {
          'tab-chat': {
            templateUrl: "templates/chat-detail.html",
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('app.tab.listfriend', {
        url: "/listfriend",
        views: {
          'tab-chat': {
            templateUrl: "templates/listfriend.html",
            controller: 'FriendsCtrl'
          }
        }
      })

      .state('app.tab.newdetail', {
        url: '/newdetail:{data}',
        views: {
          'tab-new': {
            templateUrl: 'templates/new-detail.html',
            controller: 'NewDetailCtrl'
          }
        }
      })


      .state('app.tab.me', {
        url: '/me',
        views: {
          'tab-me': {
            templateUrl: 'templates/tab-me.html',
            controller: 'NewCtrl'
          }
        }
      })

      .state('app.tab.me-detail', {
        url: '/me/:{data}',
        views: {
          'tab-me': {
            templateUrl: 'templates/me-detail.html',
            controller: 'MeDetailCtrl'
          }
        }
      })
      .state('app.tab.map', {
        url: '/map',
        views: {
          'tab-map': {
            templateUrl: 'templates/tab-map.html',
            controller: 'MapCtrl'
          }
        }
      })

      // .state('app.tab.more', {
      //   url: '/more',
      //   views: {
      //     'tab-more': {
      //       templateUrl: 'templates/tab-more.html',
      //       controller: 'MoreCtrl'
      //     }
      //   }
      // })
      .state('app.tab.listdetail', {
        url: '/listdetail',
        views: {
          'tab-more': {
            templateUrl: 'templates/listdetail.html',
            controller: 'MoreCtrl'

          }
        }
      })
      .state('app.listbl', {
        url: '/listbl',
        views: {
          'menuContent': {
            templateUrl: 'templates/listbl.html',
            controller: 'MoreCtrl'
          }
        }
      })
      .state('app.billdetail', {
        url: '/billdetail:{data}',
        views: {
          'menuContent': {
            templateUrl: 'templates/billdetail.html',
            controller: 'MoreDetailCtrl'

          }
        }
      })
      .state('app.listreceived', {
        url: '/listreceived',
        views: {
          'menuContent': {
            templateUrl: 'templates/listreceived.html',
            controller: 'MoreCtrl'
          }
        }
      })
      .state('app.detailreceived', {
        url: '/detailreceived:{data}',
        views: {
          'menuContent': {
            templateUrl: 'templates/detailreceived.html',
            controller: 'MoreDetailCtrl'
          }
        }
      })
      .state('app.listReturn', {
        url: '/listReturn',
        views: {
          'menuContent': {
            templateUrl: 'templates/listReturn.html',
            controller: 'MoreCtrl'
          }
        }
      })
      .state('app.detailreturn', {
        url: '/detailreturn:{data}',
        views: {
          'menuContent': {
            templateUrl: 'templates/detailreturn.html',
            controller: 'MoreDetailCtrl'
          }
        }
      })
      .state('app.listAr', {
        url: '/listAr',
        views: {
          'menuContent': {
            templateUrl: 'templates/listAr.html',
            controller: 'MoreCtrl'
          }
        }
      })
      .state('app.detailAr', {
        url: '/detailAr:{data}',
        views: {
          'menuContent': {
            templateUrl: 'templates/detailAr.html',
            controller: 'MoreDetailCtrl'
          }
        }
      })
      .state('app.liststock', {
        url: '/liststock',
        views: {
          'menuContent': {
            templateUrl: 'templates/liststock.html',
            controller: 'MoreCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/authen');

  })

  .directive('showHideContainer', function () {
    return {
      scope: {

      },
      controller: function ($scope, $element, $attrs) {
        $scope.show = false;

        $scope.toggleType = function ($event) {
          $event.stopPropagation();
          $event.preventDefault();

          $scope.show = !$scope.show;

          // Emit event
          $scope.$broadcast("toggle-type", $scope.show);
        };
      },
      templateUrl: 'templates/show-hide-password.html',
      restrict: 'A',
      replace: false,
      transclude: true
    };
  })

  .directive('showHideInput', function () {
    return {
      scope: {

      },
      link: function (scope, element, attrs) {
        // listen to event
        scope.$on("toggle-type", function (event, show) {
          var password_input = element[0],
            input_type = password_input.getAttribute('type');

          if (!show) {
            password_input.setAttribute('type', 'password');
          }

          if (show) {
            password_input.setAttribute('type', 'text');
          }
        });
      },
      require: '^showHideContainer',
      restrict: 'A',
      replace: false,
      transclude: false
    };
  });
