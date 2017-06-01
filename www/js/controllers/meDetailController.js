deliverApp.controller('MeDetailCtrl', function ($scope, $state, $stateParams, AuthService, $ionicPopup, $cordovaGeolocation, $ionicSideMenuDelegate, Socket, $rootScope, $ionicLoading) {
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.userStore = AuthService.getUser();
    $scope.telephone = function (telnumber) {
        var reNumber = '';
        var regex = /(\d+)/g;
        var reNum = telnumber.match(regex);
        reNum.forEach(function (item) {
            reNumber += item
        });
        // alert(reNumber);
        window.location = 'tel:' + reNumber;
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

    $scope.btnGoDetail = function (data) {
        console.log(data);
        $state.go('app.tab.profile-detailme', { data: JSON.stringify(data) });
    };

    // console.log(JSON.parse($stateParams.data));
    $scope.data = JSON.parse($stateParams.data);
    $scope.setItem = function () {
        window.localStorage.point = $stateParams.data;
    }
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
                // alert('success');
                $state.go('app.tab.me');
                $ionicLoading.hide();

            }, function (error) {
                $ionicLoading.hide();
                console.log(error);
                alert('dont success' + " " + error.data.message);
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
                    $state.go('app.tab.me');
                    $ionicLoading.hide();

                }, function (error) {
                    $ionicLoading.hide();
                    console.log(error);
                    alert('dont success' + " " + error.data.message);
                });
        }

    };

    $rootScope.chattype = 'Me';

    $scope.gotoChat2 = function (user) {
        if ($rootScope.chattype === 'normal') {
            $rootScope.chattype = 'Me';
        } else {
            $rootScope.chattype = 'Me';
        }

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
            if ($rootScope.chattype === 'Me') {
                $state.go('app.tab.chat-detailMe', { chatId: data._id });
            }

            // $scope.pageDown();
            // alert('joinsuccess : ' + JSON.stringify(data));
        });

    }

})