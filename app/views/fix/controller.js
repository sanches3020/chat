app.controller('fix', function ($scope, api, toast, $mdBottomSheet) {
    addFormats($scope)


    $scope.close = function () {
        $mdBottomSheet.hide()
    }

    $scope.price = 50
    $scope.loading = false

    $scope.replace = function () {
        api.post('api/word_update', {
            word: $scope.word.trim(),
            fix: $scope.fix.trim(),
        }).then(function () {
            $mdBottomSheet.hide()
        }).finally(function () {
            $scope.loading = false
        })
    }

})
