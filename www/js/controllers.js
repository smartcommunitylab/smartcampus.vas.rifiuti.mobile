angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };

    $rootScope.activePage = 'base';
    $rootScope.icon = '';
    $rootScope.noteSelected = 'false';

    $scope.click = function () {
        //Da implementare!
        if($rootScope.noteSelected && $rootScope.activePage == 'home-note')
        {
            $rootScope.noteSelected = 'false';
        }

    };

    $scope.delete = function () {};

    $scope.edit = function () {};
})

.controller('HomeCtrl', function ($scope, $rootScope, $ionicTabsDelegate, $timeout) {

    var delegate = $ionicTabsDelegate.$getByHandle('home-tabs');

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
