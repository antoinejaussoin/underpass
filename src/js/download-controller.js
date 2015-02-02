(function () {
    'use strict';

    var app = angular.module('underpass');

    app.controller('downloadController', function ($scope, $http) {
        $scope.link = '';
        $scope.name = '';
        $scope.isValid = false;
        $scope.isDownloading = false;
        $scope.downloadList = [];

        $scope.download = function () {
            $scope.isDownloading = true;
            $scope.downloadList.push({
                link: $scope.link,
                name: $scope.name
            });
        }

        $scope.downloadAgain = function () {
            $scope.isDownloading = false;
            $scope.link = '';
            $scope.name = '';
        }

        function guessFileName() {
            var splits = $scope.link.split('/');
            var possibleFileName = splits[splits.length - 1];
            var fileNameSplits = possibleFileName.split('.');
            if (fileNameSplits.length > 1) {
                var extension = fileNameSplits[fileNameSplits.length - 1];

                if (extension.length === 3) {
                    $scope.name = possibleFileName;
                    return;
                }
            }

            $scope.name = '';
        }

        function setValidity() {
            $scope.isValid = $scope.link.length > 8 && $scope.name.length >= 3;
        }

        $scope.$watch('link', guessFileName);
        $scope.$watch('link', setValidity);
        $scope.$watch('name', setValidity);
    });

})();