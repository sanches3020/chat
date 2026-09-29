app.controller('replace', function ($scope, api, toast, $mdDialog) {

    addFormats($scope, $mdDialog)

    $scope.price = 50
    $scope.loading = false

    $scope.replace = function () {
        if (!$scope.word || !$scope.fix || $scope.loading) {
            return
        }

        $scope.loading = true

        api.post('api/word_update', {
            word: $scope.word.trim(),
            fix: $scope.fix.trim(),
        }).then(function () {
            $mdDialog.hide()
        }).finally(function () {
            $scope.loading = false
        })
    }

})
