angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $rootScope, $timeout) {

    $rootScope.activePage = 'base';
    $rootScope.icon = '';
    $rootScope.noteSelected = 'false';

    $scope.click = function () {
        //Da implementare!
        if($rootScope.activePage && $rootScope.noteSelected == 'home-note')
        {
            $rootScope.noteSelected = 'false';
        }

    };

    $scope.delete = function () {};

    $scope.edit = function () {};
})

.controller('HomeCtrl', function ($scope, $rootScope, $ionicTabsDelegate, $timeout) {

    var delegate = $ionicTabsDelegate.$getByHandle('home-tabs');
    var notes = [];

    $timeout(function () {
        delegate.select(1);
    }, 50);

    $scope.slideChanged = function (index) {
        $rootScope.noteSelected = 'false';
        switch (index) {
        case 0:
            $rootScope.activePage = 'home-note';
            $rootScope.icon = 'ion-plus';
            break;
        case 2:
            $rootScope.activePage = 'home-calendar';
            $rootScope.icon = 'ion-calendar';
            break;
        default:
            $rootScope.activePage = 'home-main';
            $rootScope.icon = '';
        }
    };

    $scope.match = function (query) {
        if (query == '') {
            return function (item) {
                return false;
            }
        } else {
            return function (item) {
                return item.indexOf(query) != -1;
            }
        }
    }

    $scope.firstCol = function (item, v) {
        if (v.indexOf(item) % 3 == 0) return item;
        else return '';
    }

    $scope.secondCol = function (item, v) {
        if (v.indexOf(item) % 3 == 1) return item;
        else return '';
    }

    $scope.thirdCol = function (item, v) {
        if (v.indexOf(item) % 3 == 2) return item;
        else return '';
    }

    $scope.oneInThree = function (v) {
        var f = [];
        for (var i = 0; i < v.length; i = i + 3) {
            f[i / 3] = v[i];
        }
        return f;
    }
})

.controller('InfoCtrl', function ($scope, $rootScope) {

    $rootScope.activePage = 'info';
    $rootScope.icon = '';
    $rootScope.noteSelected = 'false';
})
