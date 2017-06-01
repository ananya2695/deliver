deliverApp.controller('MoreDetailCtrl', function ($scope, $state, $stateParams, ProductService, $ionicPopup, $rootScope, RequestService, ReturnService, AccuralService, $ionicSideMenuDelegate) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });

    console.log(JSON.parse($stateParams.data));
    $scope.data = JSON.parse($stateParams.data);

    $scope.showConfirm = function (data) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'คุณต้องการลบข้อมูลรายการสินค้านี้ใช่หรือไม่'
        });

        confirmPopup.then(function (res) {
            if (res) {
                $scope.deleteOrder(data);
            } else {
                // console.log('Not sure!');
            }
        });
    };

    $scope.deleteOrder = function (data) {
        ProductService.deleteOrder(data._id)
            .then(function (response) {
                $state.go('app.listbl');
            }, function (error) {
                console.log(error);
                alert('dont success' + " " + error.data.message);
            });
    }
    $scope.deliReceived = function (item) {
        var res = null;
        var listrcv =
            {
                status: 'received',
                datestatus: new Date()
            };
        item.historystatus.push(listrcv);

        var status = item.deliverystatus;
        status = 'received';
        var requestorder = {
            deliverystatus: status,
            historystatus: item.historystatus
        }
        var requestorderId = item._id;


        RequestService.updateRequestOrder(requestorderId, requestorder)
            .then(function (response) {
                // alert('success');
                $state.go('app.listreceived');
            }, function (error) {
                console.log(error);
                alert('dont success' + " " + error.data.message);
            });
    };


    $scope.deliReturn = function (item) {
        var listrcv =
            {
                status: 'return',
                datestatus: new Date()
            };
        item.historystatus.push(listrcv);

        var status = item.deliverystatus;
        status = 'return';
        var returnorder = {
            deliverystatus: status,
            historystatus: item.historystatus
        }
        var returnordersId = item._id;


        ReturnService.updateReturnOrder(returnordersId, returnorder)
            .then(function (response) {
                // alert('success');
                $state.go('app.listReturn');
            }, function (error) {
                console.log(error);
                alert('dont success' + " " + error.data.message);
            });

    };

    $scope.deliAccural = function (item) {
        var listrcv =
            {
                status: 'confirmed',
                datestatus: new Date()
            };
        item.historystatus.push(listrcv);

        var status = item.deliverystatus;
        status = 'confirmed';
        var accuralreceipt = {
            arstatus: status,
            historystatus: item.historystatus
        }
        var accuralreceiptsId = item._id;


        AccuralService.updateAccuralOrder(accuralreceiptsId, accuralreceipt)
            .then(function (response) {
                $state.go('app.listAr');
            }, function (error) {
                console.log(error);
                alert('dont success' + " " + error.data.message);
            });

    };

})