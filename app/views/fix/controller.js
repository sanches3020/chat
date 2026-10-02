app.controller('fix', function ($scope, api, loader, toast, $mdBottomSheet) {
    addFormats($scope)
    let load = loader($scope)

    $scope.close = function () {
        $mdBottomSheet.hide()
    }

    $scope.replace = function () {
        load.post('api/word_update', {
            word: $scope.word,
            fix: $scope.fix,
        }).then($scope.close)
    }
})
