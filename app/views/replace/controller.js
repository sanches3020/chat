app.controller('replace', function ($scope, api, toast, $mdDialog) {

    $scope.replace = function () {
        api.post('api/word_update', {
            word: $scope.word,
            fix: $scope.fix,
        }).then(function () {
            $mdDialog.hide()
        })
    }

})
