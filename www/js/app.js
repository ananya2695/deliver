// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

  .run(function ($ionicPlatform) {
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

      .state('listbl', {
        url: '/listbl',
        templateUrl: 'templates/listbl.html',
        controller: 'MoreCtrl'
      })
      .state('billdetail', {
        url: '/billdetail:{data}',
        templateUrl: 'templates/billdetail.html',
        controller: 'MoreDetailCtrl'
      })

      .state('listdetail', {
        url: '/listdetail',
        templateUrl: 'templates/listdetail.html',
        controller: 'MoreCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/authen');

  });
