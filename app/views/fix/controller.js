app.controller('fix', function ($scope, api, loader, toast, $mdBottomSheet) {
    addFormats($scope)
    let load = loader($scope)

    $scope.close = function () {
        $mdBottomSheet.hide()
    }

    $scope.selectType = function (word_type) {
        $scope.word_type = word_type
    }

    $scope.replace = function () {
        load.post('api/word_update', {
            word: $scope.word,
            fix: $scope.fix,
            word_type: $scope.word_type,
        }).then($scope.close)
    }
})
