// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'angularMoment', 'satellizer', 'btford.socket-io'])

  .run(function ($ionicPlatform, AuthService) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
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

  .config(function ($stateProvider, $urlRouterProvider) {
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
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('authen', {
        url: '/authen',
        templateUrl: 'templates/authentication.html',
        controller: 'LogInCtrl'
      })

      .state('tab.new', {
        url: '/new',
        views: {
          'tab-new': {
            templateUrl: 'templates/tab-new.html',
            controller: 'NewCtrl'
          }
        }
      })

      ////////////////////////////////////////////////
      .state('tab.profile-detail', {
        url: '/profile-detail:{data}',
        views: {
          'tab-new': {
            templateUrl: 'templates/user-profile-detail.html',
            controller: 'ProfileDetailCtrl'
          }
        }
      })

      .state('tab.chat', {
        url: "/chat",
        views: {
          'tab-chat': {
            templateUrl: "templates/tab-chat.html",
            controller: 'ChatCtrl'
          }
        }
      })

      .state('tab.chat-detail', {
        url: "/chat/:chatId",
        views: {
          'tab-chat': {
            templateUrl: "templates/chat-detail.html",
            controller: 'ChatDetailCtrl'
          }
        }
      })
      //////////////////////////////////////////////////
      .state('tab.newdetail', {
        url: '/newdetail:{data}',
        views: {
          'tab-new': {
            templateUrl: 'templates/new-detail.html',
            controller: 'NewDetailCtrl'
          }
        }
      })


      .state('tab.me', {
        url: '/me',
        views: {
          'tab-me': {
            templateUrl: 'templates/tab-me.html',
            controller: 'NewCtrl'
          }
        }
      })

      .state('tab.me-detail', {
        url: '/me/:{data}',
        views: {
          'tab-me': {
            templateUrl: 'templates/me-detail.html',
            controller: 'MeDetailCtrl'
          }
        }
      })
      .state('tab.map', {
        url: '/map',
        views: {
          'tab-map': {
            templateUrl: 'templates/tab-map.html',
            controller: 'MapCtrl'
          }
        }
      })

      .state('tab.more', {
        url: '/more',
        views: {
          'tab-more': {
            templateUrl: 'templates/tab-more.html',
            controller: 'MoreCtrl'
          }
        }
      })

      .state('tab.listbl', {
        url: '/listbl',
        views: {
          'tab-more': {
            templateUrl: 'templates/listbl.html',
            controller: 'MoreCtrl'
          }
        }
      })


      .state('tab.billdetail', {
        url: '/billdetail:{data}',
        views: {
          'tab-more': {
            templateUrl: 'templates/billdetail.html',
            controller: 'MoreDetailCtrl'

          }
        }
      })

      .state('tab.listdetail', {
        url: '/listdetail',
        views: {
          'tab-more': {
            templateUrl: 'templates/listdetail.html',
            controller: 'MoreCtrl'

          }
        }
      })

      .state('tab.listreceived', {
        url: '/listreceived',
        views: {
          'tab-more': {
            templateUrl: 'templates/listreceived.html',
            controller: 'MoreCtrl'
          }
        }
      })

      .state('tab.detailreceived', {
        url: '/detailreceived:{data}',
        views: {
          'tab-more': {
            templateUrl: 'templates/detailreceived.html',
            controller: 'MoreDetailCtrl'
          }
        }
      })
      .state('tab.listReturn', {
        url: '/listReturn',
        views: {
          'tab-more': {
            templateUrl: 'templates/listReturn.html',
            controller: 'MoreCtrl'
          }
        }
      })
      .state('tab.detailreturn', {
        url: '/detailreturn:{data}',
        views: {
          'tab-more': {
            templateUrl: 'templates/detailreturn.html',
            controller: 'MoreDetailCtrl'
          }
        }
      })
      .state('tab.listAr', {
        url: '/listAr',
        views: {
          'tab-more': {
            templateUrl: 'templates/listAr.html',
            controller: 'MoreCtrl'
          }
        }
      })
      .state('tab.detailAr', {
        url: '/detailAr:{data}',
        views: {
          'tab-more': {
            templateUrl: 'templates/detailAr.html',
            controller: 'MoreDetailCtrl'
          }
        }
      })
      .state('tab.liststock', {
        url: '/liststock',
        views: {
          'tab-more': {
            templateUrl: 'templates/liststock.html',
            controller: 'MoreCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/authen');

  });