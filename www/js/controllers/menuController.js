deliverApp.controller('MenuCtrl', function ($scope, $ionicHistory, $http, $state, AuthService, $ionicModal, $rootScope, ProductService, RequestService, ReturnService, AccuralService, StockService, $stateParams, $ionicSideMenuDelegate) {
    $rootScope.userStore = AuthService.getUser();
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });

    $rootScope.countAllBadge = 0;
    $scope.countlistreceiveds = 0;
    $scope.countStock = 0;
    $scope.countlistReturned = 0;
    $scope.countlistAr = 0;

    $rootScope.getInitBadge = function () {

        $scope.requestorders();

    }
    // get 1
    $scope.requestorders = function () {
        $rootScope.userStore = AuthService.getUser();
        RequestService.getRequests()
            .then(function (data) {

                $scope.listRequest = [];
                $scope.listResponse = [];
                $scope.listReceived = [];
                data.forEach(function (request) {
                    if ($rootScope.userStore && request.namedeliver && $rootScope.userStore._id === request.namedeliver._id) {
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

                // if ($scope.listRequest) {
                //   $scope.countlistRequest = $scope.listRequest.length;
                // }
                // if ($scope.listResponse) {
                //   $scope.countlistResponse = $scope.listResponse.length;
                // }
                // if ($scope.listReceived) {
                //   $scope.countlistReceived = $scope.listReceived.length;
                // }

                $scope.countlistreceiveds = $scope.listRequest.length;

                // get 2
                $scope.returnorders();
            });
    }

    $scope.returnorders = function () {
        ReturnService.getReturns()
            .then(function (data) {

                $scope.listReturns = [];
                $scope.listreturnResponse = [];
                $scope.listreturnReceived = [];
                data.forEach(function (ret) {
                    if ($rootScope.userStore && ret.namedeliver && $rootScope.userStore._id === ret.namedeliver._id) {
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

                // if ($scope.listReturns) {
                //   $scope.countlistReturns = $scope.listReturns.length;
                // }
                // if ($scope.listreturnResponse) {
                //   $scope.countlistreturnResponse = $scope.listreturnResponse.length;
                // }
                // if ($scope.listreturnReceived) {
                //   $scope.countlistreturnReceived = $scope.listreturnReceived.length;
                // }

                $scope.countlistReturned = $scope.listReturns.length;

                // get 3
                $scope.accuralreceipts();
            });

    }

    $scope.accuralreceipts = function () {
        AccuralService.getAccurals()
            .then(function (data) {

                $scope.listarWait = [];
                $scope.listarConfirmed = [];
                $scope.listarReceipt = [];
                data.forEach(function (ar) {
                    if ($rootScope.userStore && ar.namedeliver && $rootScope.userStore._id === ar.namedeliver._id) {
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

                // if ($scope.listarWait) {
                //   $scope.countlistarWait = $scope.listarWait.length;
                // }
                // if ($scope.listarConfirmed) {
                //   $scope.countlistarConfirmed = $scope.listarConfirmed.length;
                // }
                // if ($scope.listarReceipt) {
                //   $scope.countlistarReceipt = $scope.listarReceipt.length;
                // }

                $scope.countlistAr = $scope.listarWait.length;

                // get 4
                $scope.stocks();
            });
    }

    $scope.stocks = function () {
        // StockService.getStocks()
        //   .then(function (data) {
        //     $scope.stockdeli = [];
        //     data.forEach(function (stock) {
        //       if (stock.namedeliver && $scope.userStore._id === stock.namedeliver._id) {
        //         $scope.stockdeli.push(stock);
        //         $scope.countStock = stock.stocks.length;
        //       }
        //     });

        $rootScope.countAllBadge = $scope.countlistreceiveds + $scope.countlistReturned + $scope.countlistAr;
        // });
    }

    $scope.listbl = function () {
        $state.go('app.listbl');
    };

    $scope.listreceived = function () {
        $state.go('app.listreceived');
    };

    $scope.liststock = function () {
        $state.go('app.liststock');
    };

    $scope.listReturn = function () {
        $state.go('app.listReturn');
    };

    $scope.listAr = function () {
        $state.go('app.listAr');
    };

    $scope.doLogOut = function () {
        AuthService.signOut();
        $state.go('authen');
    };

});