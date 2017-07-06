deliverApp.controller('MapCtrl', function ($scope, $rootScope, $http, $state, AuthService, $stateParams, $cordovaGeolocation, $compile, $ionicLoading, $ionicSideMenuDelegate, $ionicHistory) {
    $scope.$on('$ionicView.enter', function () {
        // $ionicHistory.clearHistory();
        $ionicSideMenuDelegate.canDragContent(false);
    });

    var lat = null;
    var long = null;
    var map;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    $scope.init = function () {
        $scope.readMap();
    }

    $scope.clearItem = function () {
        window.localStorage.removeItem("point");
        $state.go('app.tab.map');
    }
    // $scope.$on('onLoginSuccess', function (event, args) {
    //   // do what you want to do
    //   //alert();
    //   $scope.init();
    // });
    $scope.readMap = function () {
        // console.log('ok');
        // alert('map');
        $ionicLoading.show({ template: 'กรุณารอสักครู่' });
        if ($rootScope.readOrder) {
            $rootScope.readOrder();
        }

        $scope.locationOrdersWait = [];
        $scope.locationOrdersApt = [];
        $scope.locationOrdersComf = [];
        $scope.locationOrdersRej = [];


        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                lat = position.coords.latitude
                long = position.coords.longitude
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: new google.maps.LatLng(lat, long), //เปลี่ยนตามต้องการ
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                $scope.map = map;

                //////ตำแหน่งที่ mark ปัจจุบัน///////////
                var marker = new google.maps.Marker({
                    position: map.getCenter(),
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 15,
                        fillColor: 'blue',
                        fillOpacity: 0.2,
                        strokeColor: 'blue',
                        strokeWeight: 0
                    },
                    draggable: true,
                    map: map
                });
                var marker = new google.maps.Marker({
                    position: map.getCenter(),
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#1c90f3',
                        fillOpacity: 0.5,
                        strokeColor: 'white',
                        strokeWeight: 1
                    },
                    draggable: true,
                    map: map
                });
                AuthService.getOrderv3(lat, long)
                    .then(function (data) {
                        var userStore = AuthService.getUser();
                        $rootScope.ordersConfirmedv3 = data.confirmed;
                        $rootScope.ordersWaitv3 = data.wait;
                        $rootScope.ordersAcceptv3 = data.accept;
                        $rootScope.ordersRejectv3 = data.reject;
                        $scope.readMap();
                        if (!window.localStorage.point || window.localStorage.point === "") {

                            $scope.locationOrdersWait = $rootScope.ordersWaitv3;
                            $scope.locationOrdersApt = $rootScope.ordersAcceptv3;
                            $scope.locationOrdersComf = $rootScope.ordersConfirmedv3;
                            $scope.locationOrdersRej = $rootScope.ordersRejectv3;
                            // alert(JSON.stringify($scope.locationOrdersComf));
                            // alert(JSON.stringify($scope.locationOrdersRej));

                            $scope.locationOrdersComf.forEach(function (locations) {
                                var product = '';
                                var price = null;
                                locations.items.forEach(function (pro) {
                                    if (pro.product) {
                                        product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                                    }
                                })
                                var contentString = $compile('<div>'
                                    + '<label>' + locations.shipping.firstname + ' ' + locations.shipping.lastname + '</label><br>'
                                    + '<p>' + locations.shipping.address + ' ' + locations.shipping.subdistrict + ' ' + locations.shipping.district + ' ' + locations.shipping.province + ' ' + locations.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + locations.shipping.tel + '">' + locations.shipping.tel + '</a>' + '</p>'
                                    + '<p>' + product + '</p>'
                                    + '<label>' + 'ราคารวม : ' + locations.amount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ค่าจัดส่ง : ' + locations.deliveryamount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ส่วนลด : ' + locations.discountpromotion + ' บาท' + '</label><br>'
                                    + '<label>' + 'รวมสุทธิ : ' + locations.totalamount + ' บาท' + '</label>'
                                    + '<button class="button button-block button-outline button-positive icon-left ion-ios-location" ng-click="openMap(' + locations.shipping.sharelocation.latitude + ',' + locations.shipping.sharelocation.longitude + ')"> นำทาง </button>'
                                    + '<button class="button button-block button-outline button-positive" ng-click="openDetailComf(\'' + locations._id + '\')"> รายละเอียด </button>'
                                    + '</div>')($scope);
                                var location = locations.shipping.sharelocation;
                                // console.log($scope.locationConfirmed.length);
                                if (location) {
                                    var marker = new google.maps.Marker({
                                        icon: {
                                            url: ' http://res.cloudinary.com/hpipugeai/image/upload/v1496373961/som_iuw9au.png',
                                            scaledSize: new google.maps.Size(32, 51),
                                            // The origin for this image is (0, 0). 
                                            origin: new google.maps.Point(0, 0),
                                            // The anchor for this image is the base of the flagpole at (0, 32). 
                                            //anchor: new google.maps.Point(0, 32)
                                        },
                                        position: new google.maps.LatLng(location.latitude, location.longitude),
                                        map: map
                                    });

                                    var infowindow = new google.maps.InfoWindow({
                                        content: contentString[0]
                                    });
                                    marker.addListener('click', function () {
                                        // console.log('click');
                                        infowindow.open($scope.map, this);
                                    });
                                }

                            });

                            $scope.locationOrdersRej.forEach(function (locations) {
                                var product = '';
                                var price = null;
                                locations.items.forEach(function (pro) {
                                    if (pro.product) {
                                        product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                                    }
                                })
                                var contentString = $compile('<div>'
                                    + '<label>' + locations.shipping.firstname + ' ' + locations.shipping.lastname + '</label><br>'
                                    + '<p>' + locations.shipping.address + ' ' + locations.shipping.subdistrict + ' ' + locations.shipping.district + ' ' + locations.shipping.province + ' ' + locations.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + locations.shipping.tel + '">' + locations.shipping.tel + '</a>' + '</p>'
                                    + '<p>' + product + '</p>'
                                    + '<label>' + 'ราคารวม : ' + locations.amount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ค่าจัดส่ง : ' + locations.deliveryamount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ส่วนลด : ' + locations.discountpromotion + ' บาท' + '</label><br>'
                                    + '<label>' + 'รวมสุทธิ : ' + locations.totalamount + ' บาท' + '</label>'
                                    + '<button class="button button-block button-outline button-positive icon-left ion-ios-location" ng-click="openMap(' + locations.shipping.sharelocation.latitude + ',' + locations.shipping.sharelocation.longitude + ')"> นำทาง </button>'
                                    + '<button class="button button-block button-outline button-positive" ng-click="openDetailRej(\'' + locations._id + '\')"> รายละเอียด </button>'
                                    + '</div>')($scope);
                                var location = locations.shipping.sharelocation;
                                // console.log($scope.locationConfirmed.length);
                                if (location) {
                                    var marker = new google.maps.Marker({
                                        icon: {
                                            url: 'http://res.cloudinary.com/hpipugeai/image/upload/v1496373894/dang_bi1wxc.png',
                                            scaledSize: new google.maps.Size(32, 51),
                                            // The origin for this image is (0, 0). 
                                            origin: new google.maps.Point(0, 0),
                                            // The anchor for this image is the base of the flagpole at (0, 32). 
                                            //anchor: new google.maps.Point(0, 32)
                                        },
                                        position: new google.maps.LatLng(location.latitude, location.longitude),
                                        map: map
                                    });

                                    var infowindow = new google.maps.InfoWindow({
                                        content: contentString[0]
                                    });
                                    marker.addListener('click', function () {
                                        // console.log('click');
                                        infowindow.open($scope.map, this);
                                    });
                                }

                            });

                            $scope.locationOrdersWait.forEach(function (locations) {
                                var product = '';
                                var price = null;
                                locations.items.forEach(function (pro) {
                                    if (pro.product) {
                                        product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                                    }
                                })
                                var contentString = $compile('<div>'
                                    + '<label>' + locations.shipping.firstname + ' ' + locations.shipping.lastname + '</label><br>'
                                    + '<p>' + locations.shipping.address + ' ' + locations.shipping.subdistrict + ' ' + locations.shipping.district + ' ' + locations.shipping.province + ' ' + locations.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + locations.shipping.tel + '">' + locations.shipping.tel + '</a>' + '</p>'
                                    + '<p>' + product + '</p>'
                                    + '<label>' + 'ราคารวม : ' + locations.amount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ค่าจัดส่ง : ' + locations.deliveryamount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ส่วนลด : ' + locations.discountpromotion + ' บาท' + '</label><br>'
                                    + '<label>' + 'รวมสุทธิ : ' + locations.totalamount + ' บาท' + '</label>'
                                    + '<button class="button button-block button-outline button-positive icon-left ion-ios-location" ng-click="openMap(' + locations.shipping.sharelocation.latitude + ',' + locations.shipping.sharelocation.longitude + ')"> นำทาง </button>'
                                    + '<button class="button button-block button-outline button-positive" ng-click="openDetailWait(\'' + locations._id + '\')"> รายละเอียด </button>'
                                    + '</div>')($scope);
                                var location = locations.shipping.sharelocation;
                                // console.log($scope.locationConfirmed.length);
                                if (location) {
                                    var marker = new google.maps.Marker({
                                        icon: {
                                            url: ' http://res.cloudinary.com/hflvlav04/image/upload/v1486371643/riwxnxtjdfjganurw46m.png',
                                            scaledSize: new google.maps.Size(32, 51),
                                            // The origin for this image is (0, 0). 
                                            origin: new google.maps.Point(0, 0),
                                            // The anchor for this image is the base of the flagpole at (0, 32). 
                                            //anchor: new google.maps.Point(0, 32)
                                        },
                                        position: new google.maps.LatLng(location.latitude, location.longitude),
                                        map: map
                                    });

                                    var infowindow = new google.maps.InfoWindow({
                                        content: contentString[0]
                                    });
                                    marker.addListener('click', function () {
                                        // console.log('click');
                                        infowindow.open($scope.map, this);
                                    });
                                }

                            });

                            $scope.locationOrdersApt.forEach(function (locations) {
                                var product = '';
                                var price = null;
                                locations.items.forEach(function (pro) {
                                    if (pro.product) {
                                        product += 'ชื่อสินค้า : ' + pro.product.name + '<br> ราคา : ' + pro.product.price + ' บาท จำนวน : ' + pro.qty + ' ชิ้น<br>';
                                    }
                                })
                                var contentString = $compile('<div>'
                                    + '<label>' + locations.shipping.firstname + ' ' + locations.shipping.lastname + '</label><br>'
                                    + '<p>' + locations.shipping.address + ' ' + locations.shipping.subdistrict + ' ' + locations.shipping.district + ' ' + locations.shipping.province + ' ' + locations.shipping.postcode + '<br>โทร : ' + '<a href="tel:' + locations.shipping.tel + '">' + locations.shipping.tel + '</a>' + '</p>'
                                    + '<p>' + product + '</p>'
                                    + '<label>' + 'ราคารวม : ' + locations.amount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ค่าจัดส่ง : ' + locations.deliveryamount + ' บาท' + '</label><br>'
                                    + '<label>' + 'ส่วนลด : ' + locations.discountpromotion + ' บาท' + '</label><br>'
                                    + '<label>' + 'รวมสุทธิ : ' + locations.totalamount + ' บาท' + '</label>'
                                    + '<button class="button button-block button-outline button-positive icon-left ion-ios-location" ng-click="openMap(' + locations.shipping.sharelocation.latitude + ',' + locations.shipping.sharelocation.longitude + ')"> นำทาง </button>'
                                    + '<button class="button button-block button-outline button-positive" ng-click="openDetailAccept(\'' + locations._id + '\')"> รายละเอียด </button>'
                                    + '</div>')($scope);
                                // console.log(locations);
                                var location = locations.shipping.sharelocation;
                                // console.log(location);
                                // console.log($scope.locationConfirmed.length);
                                if (location) {
                                    var marker = new google.maps.Marker({
                                        icon: {
                                            url: 'http://res.cloudinary.com/hflvlav04/image/upload/v1486371632/sj4niz8oykdqfadnwhbo.png',
                                            scaledSize: new google.maps.Size(28, 45),
                                            // The origin for this image is (0, 0). 
                                            origin: new google.maps.Point(0, 0),
                                            // The anchor for this image is the base of the flagpole at (0, 32). 
                                            // anchor: new google.maps.Point(0, 32)
                                        },
                                        position: new google.maps.LatLng(location.latitude, location.longitude),
                                        map: map
                                    });
                                    var infowindow = new google.maps.InfoWindow({
                                        content: contentString[0]
                                    });
                                    marker.addListener('click', function () {
                                        console.log('click');
                                        infowindow.open($scope.map, this);
                                    });
                                }
                            });

                        } else {
                            var pointStart = {
                                lat: parseFloat(lat),
                                lng: parseFloat(long)
                            }
                            $scope.calcRoute(pointStart);
                        }
                        $ionicLoading.hide();
                    });


            }, function (err) {
                // error
            });
    }

    $scope.calcRoute = function (pointStart) {
        var item = JSON.parse(window.localStorage.point);
        if (item) {
            var pointEnd = {
                lat: parseFloat(item.shipping.sharelocation.latitude),
                lng: parseFloat(item.shipping.sharelocation.longitude)
            }
            var routePoints = {
                start: { lat: pointStart.lat, lng: pointStart.lng },
                end: { lat: pointEnd.lat, lng: pointEnd.lng }
            }
            directionsDisplay.setDirections({ routes: [] });
            directionsDisplay.setMap($scope.map);

            var start = routePoints.start;
            var end = routePoints.end;
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
        }

        window.localStorage.removeItem("point");
        return;

    }

    $scope.openDetailWait = function (dataId) {
        $scope.dataOrdersWait = $rootScope.ordersWaitv3;
        $scope.dataOrdersWait.forEach(function (data) {
            if (data._id === dataId) {
                $state.go('app.tab.newdetailformmap', { data: JSON.stringify(data) });
            }
        });
    };

    $scope.openDetailComf = function (dataId) {
        $scope.locationOrdersComf = $rootScope.ordersConfirmedv3;
        $scope.locationOrdersComf.forEach(function (data) {
            if (data._id === dataId) {
                $state.go('app.tab.newdetailformmap', { data: JSON.stringify(data) });
            }
        });
    };

    $scope.openDetailRej = function (dataId) {
        $scope.locationOrdersRej = $rootScope.ordersRejectv3;
        $scope.locationOrdersRej.forEach(function (data) {
            if (data._id === dataId) {
                $state.go('app.tab.newdetailformmap', { data: JSON.stringify(data) });
            }
        });
    };

    $scope.openDetailAccept = function (dataId) {
        $scope.dataOrdersAccept = $rootScope.ordersAcceptv3;
        $scope.dataOrdersAccept.forEach(function (data) {
            if (data._id === dataId) {
                $state.go('app.tab.me-detailformmap', { data: JSON.stringify(data) });
            }
        });
    };

    $scope.openMap = function (la, long) {
        $scope.Platform = window.localStorage.adminplatform;
        var address = la + ", " + long;
        var url = '';
        if ($scope.Platform === 'iOS' || $scope.Platform === 'iPhone') {
            url = "http://maps.apple.com/maps?q=" + encodeURIComponent(address);
        } else if ($scope.Platform === 'Android' || $scope.Platform === 'IEMobile' || $scope.Platform === 'BlackBerry') {
            url = "geo:?q=" + encodeURIComponent(address);
        } else {
            url = "http://maps.google.com?q=" + encodeURIComponent(address);
        }
        window.open(url, "_system", 'location=yes');
    }

    $scope.pinDirection = function (lati, lngi) {
        var routePoints = {
            start: { lat: lat, lng: long },
            end: { lat: parseFloat(lati), lng: parseFloat(lngi) }
        }

        directionsDisplay.setDirections({ routes: [] });
        directionsDisplay.setMap($scope.map);

        var start = routePoints.start;
        var end = routePoints.end;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }

})