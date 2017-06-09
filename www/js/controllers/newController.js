deliverApp.controller('NewCtrl', function ($scope, $rootScope, $ionicLoading, $http, $timeout, $state, AuthService, $stateParams, $ionicSideMenuDelegate, $ionicPopup, $ionicPopover) {

    $rootScope.ordersConfirmed = [];
    $rootScope.ordersWait = [];
    $rootScope.ordersAccept = [];
    $rootScope.ordersReject = [];
    $rootScope.ordersCancel = [];
    $rootScope.ordersComplete = [];
    $scope.limitTo = 20;
    $scope.leftMoreNew = 0;
    $scope.leftMoreMe = 0;
    $scope.showInfiniteNew = true;
    $scope.showInfiniteMe = true;
    $scope.popoverFilter = "";
    var orderId = $stateParams.orderId;

    function resetLeftMore() {
        $scope.leftMoreNew = 0;
        $scope.leftMoreMe = 0;
    }

    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.btnGo = function (data) {
        $ionicLoading.show({ template: 'กรุณารอสักครู่' });
        $rootScope.orders = [];
        $state.go('app.tab.newdetail', { data: JSON.stringify(data) });
        $ionicLoading.hide();
    }
    $scope.init = function () {
        $rootScope.readOrder();
    };

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
                resetLeftMore()
                $scope.init();
            }, function (error) {
                $ionicLoading.hide();
                if (error.data.message == "order is already accept") {
                    alert('รายการนี้มีผู้รับแล้ว');
                    resetLeftMore()
                    $state.go('app.tab.new');
                } else {
                    console.log(error);
                    alert('dont success' + " " + error.data.message);
                }
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
                    resetLeftMore()
                    $scope.init();
                }, function (error) {
                    $ionicLoading.hide();
                    console.log(error);
                    alert('dont success' + " " + error.data.message);
                });
        }
    };
    $scope.completeDeliver = function (item) {
        $ionicLoading.show({ template: 'กรุณารอสักครู่' });
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
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                alert('dont success' + " " + error.data.message);
            });
    };
    $scope.doRefresh = function () {
        $scope.init();
        $scope.$broadcast('scroll.refreshComplete');
    };
    $rootScope.readOrder = function (bl) {
        resetLeftMore()
        $ionicLoading.show({ template: 'กรุณารอสักครู่' });
        var orders = [];
        $scope.limitTo = 0;
        $rootScope.orders = [];
        $rootScope.ordersApt = [];
        $scope.showInfiniteNew = true;
        $scope.showInfiniteMe = true;
        AuthService.getOrder()
            .then(function (data) {
                var userStore = AuthService.getUser();
                $rootScope.ordersConfirmed = data.confirmed;
                $rootScope.ordersWait = data.wait;
                $rootScope.ordersAccept = data.accept;
                $rootScope.ordersReject = data.reject;
                $rootScope.ordersCancel = data.cancel;
                $rootScope.ordersComplete = data.complete;
                orders = orders.concat($rootScope.ordersWait, $rootScope.ordersConfirmed, $rootScope.ordersReject);
                $rootScope.orders = orders;
                $rootScope.ordersApt = $rootScope.ordersAccept
                $rootScope.countOrder = $rootScope.orders.length;
                $rootScope.countOrderApt = $rootScope.ordersAccept.length;

                $scope.limitTo = 20
                if ($rootScope.orders.length > 20) {
                    $scope.limitTo = 20;
                    $scope.leftMoreNew = $rootScope.orders.length - $scope.limitTo;
                    $scope.showInfiniteNew = true;
                } else {
                    $scope.limitTo = 20;
                    $scope.leftMoreNew = 0;
                    $scope.showInfiniteNew = false;
                }
                if ($rootScope.ordersApt.length > 20) {
                    $scope.limitTo = 20;
                    $scope.leftMoreMe = $rootScope.ordersApt.length - $scope.limitTo;
                    $scope.showInfiniteMe = true;
                } else {
                    $scope.limitTo = 20;
                    $scope.leftMoreMe = 0;
                    $scope.showInfiniteMe = false;
                }
                $rootScope.getInitBadge();
                if (bl) {
                    $rootScope.setDataBl();
                }
                $ionicLoading.hide();
            });
    }

    $scope.loadMoreNew = function (orders, tab) {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        if (orders.length > 0) {
            $scope.limitTo += 20;
            $scope.leftMoreNew -= 20;
            $scope.leftMoreMe -= 20;

            if (tab == 'new' && $scope.leftMoreNew <= 0) {
                $scope.showInfiniteNew = false;
            } else if (tab == 'me' && $scope.leftMoreMe <= 0) {
                $scope.showInfiniteMe = false;
            } else {
                if (tab == 'new') {
                    $scope.showInfiniteNew = true;
                } else {
                    $scope.showInfiniteMe = true;
                }
            }
        }
    };

    $scope.filter = function (filter, orders) {
        if (filter.length > 4) {
            $scope.limitTo = orders.length;
            $scope.filterText = filter;
            $scope.showInfiniteNew = false;
            $scope.showInfiniteMe = false;
        } else {
            $scope.limitTo = 20;
            $scope.filterText = "";
            $scope.showInfiniteNew = true;
            $scope.showInfiniteMe = true;
        }
    }

    $scope.$on('onNotification', function (event, args) {
        $scope.init();
    });
    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        $scope.limitTo = 20;
    });

    $scope.btnGo2 = function (data) {
        // console.log(data);
        $ionicLoading.show({ template: 'กรุณารอสักครู่' });
        $rootScope.ordersApt = [];
        $state.go('app.tab.me-detail', { data: JSON.stringify(data) });
        $ionicLoading.hide();
    }
    $scope.openFilter = function ($event) {
        $ionicPopover.fromTemplateUrl('templates/popoverFilter.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
            $scope.popover.show($event);
        });
    }

    $scope.clickFilter = function (filter) {
        setTimeout(function () {
            $scope.popoverFilter = filter;
            $scope.filterText = { deliverystatus: filter };
            $scope.popover.hide();
            var newFilter = [];
            if (filter == "wait deliver") {
                $rootScope.orders = newFilter.concat($rootScope.ordersWait);
            } else if (filter == "!wait deliver") {
                $rootScope.orders = newFilter.concat($rootScope.ordersReject, $rootScope.ordersConfirmed);
            } else {
                $rootScope.orders = newFilter.concat($rootScope.ordersWait, $rootScope.ordersReject, $rootScope.ordersConfirmed);
            }

            if ($rootScope.orders.length > 20) {
                $scope.limitTo = 20;
                $scope.leftMoreNew = $rootScope.orders.length - $scope.limitTo;
                $scope.showInfiniteNew = true;
            } else {
                $scope.leftMoreNew = 0;
                $scope.limitTo = $rootScope.orders.length
                $scope.showInfiniteNew = false;
            }
        }, 500);
    }
})