(function () {
    'use strict';

	var app = angular.module('underpass');

	app.controller('downloadController', function($scope, $http) {
		$scope.link = 'http://localhost:3000/dl/git.exe';
		$scope.name = 'git.exe';
		$scope.isValid = false;
		$scope.isDownloading = false;
		$scope.events = '';

		$scope.download = function() {
			$scope.isDownloading = true;
		}

		$scope.downloadAgain = function(){
			$scope.isDownloading = false;
			$scope.link = '';
			$scope.name = '';
		}

		function guessFileName(){
			var splits  = $scope.link.split('/');
			var possibleFileName = splits[splits.length - 1];
			var fileNameSplits = possibleFileName.split('.');
			if (fileNameSplits.length > 1){
				var extension = fileNameSplits[fileNameSplits.length - 1];

				if (extension.length === 3){
					$scope.name = possibleFileName;
					return;
				}
			}

			$scope.name = '';
		}

		function setValidity(){
			$scope.isValid = $scope.link.length > 8 && $scope.name.length >= 3;
		}

		var socket = io();
		socket.on('file', function(data){
			$scope.events += data.hello + '<br />';
		})

		$scope.$watch('link', guessFileName);
		$scope.$watch('link', setValidity);
		$scope.$watch('name', setValidity);
	});

})();