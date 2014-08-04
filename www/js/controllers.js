angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope) {})

.controller('HomeCtrl', function ($scope, $ionicTabsDelegate, $ionicSideMenuDelegate, $timeout, $ionicPopup) {

    var delegate = $ionicTabsDelegate.$getByHandle('home-tabs');
    $scope.notes = [{
        id: 0,
        note: 'uno'
    }, {
        id: 1,
        note: 'due'
    }, {
        id: 2,
        note: 'tre'
    }];
    $scope.selectedNotes = [];

    $scope.noteSelected = false;
    $scope.multipleNoteSelected = false;

    $timeout(function () {
        delegate.select(1);
    }, 50);

    $scope.addNote = function (nota) {
        $scope.notes.push({
            id: function () {
                for (var i = 0; i <= $scope.notes.length; i = i + 1) {
                    if (function (i) {
                        for (var j = 0; j < $scope.notes.length; j = j + 1) {
                            if ($scope.notes[j].id == i) {
                                return false;
                            }
                        }
                        return true;
                    }) {
                        return i;
                    }
                }
            },
            note: nota
        });
    };

    $scope.removeNote = function (id) {
        for (var i = 0; i < $scope.notes.length; i = i + 1) {
            if ($scope.notes[i].id == id) {
                $scope.notes.splice(i, 1);
            }
        }
    };

    $scope.noteSelect = function (nota) {
        var p = $scope.selectedNotes.indexOf(nota);
        if (p == -1) {
            $scope.selectedNotes.push(nota);
            $scope.noteSelected = true;
            if ($scope.selectedNotes.length > 1) {
                $scope.multipleNoteSelected = true;
            }
        } else {
            $scope.selectedNotes.splice(p, 1);
            if ($scope.selectedNotes.length <= 1) {
                $scope.multipleNoteSelected = false;
            }
            if ($scope.selectedNotes.length < 1) {
                $scope.noteSelected = false;
            }
        }
    };

    $scope.click = function () {
        if ($scope.noteSelected) {
            while ($scope.selectedNotes.length > 0) {
                $scope.removeNote($scope.selectedNotes[0].id);
                $scope.noteSelect($scope.selectedNotes[0]);
            }
        } else {
            $scope.data = {};

            var popup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.nota">',
                title: 'Cosa vuoi ricordare?',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.nota) {
                                e.preventDefault();
                            } else {
                                return $scope.data.nota;
                            }
                        }
                }
            ]
            });
            popup.then(function (res) {
                if (res != null && res != undefined) {
                    $scope.addNote(res);
                }
            });
        }
    };

    $scope.edit = function () {
        $scope.data = {};

        var popup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.nota">',
            title: 'Cosa vuoi ricordare?',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancel'
                    },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.nota) {
                            e.preventDefault();
                        } else {
                            return $scope.data.nota;
                        }
                    }
                }
            ]
        });
        popup.then(function (res) {
            if (res != null && res != undefined) {
                $scope.notes[$scope.notes.indexOf($scope.selectedNotes[0])].note = res;
                $scope.noteSelect($scope.selectedNotes[0]);
            }
        });
    };

    $scope.noteReset = function () {
        $scope.selectedNotes = [];
        $scope.noteSelected = false;
        $scope.multipleNoteSelected = false;
    };

    $scope.titleText = function () {
        if (!$scope.noteSelected) {
            return '100% Riciclo';
        } else {
            return '';
        }
    };

    $scope.leftClick = function () {
        if (!$scope.noteSelected) {
            $ionicSideMenuDelegate.toggleLeft();
        } else {
            $scope.noteReset();
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
    };

    $scope.firstCol = function (item, v) {
        if (v.indexOf(item) % 3 == 0) return item;
        else return '';
    };

    $scope.secondCol = function (item, v) {
        if (v.indexOf(item) % 3 == 1) return item;
        else return '';
    };

    $scope.thirdCol = function (item, v) {
        if (v.indexOf(item) % 3 == 2) return item;
        else return '';
    };

    $scope.oneInThree = function (v) {
        var f = [];
        for (var i = 0; i < v.length; i = i + 3) {
            f[i / 3] = v[i];
        }
        return f;
    };
})

.controller('InfoCtrl', function ($scope) {})
