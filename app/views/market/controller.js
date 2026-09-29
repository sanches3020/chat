app.controller('market', function ($scope, api, toast, $mdDialog, dialog) {

    addFormats($scope, $mdDialog)
    $scope.words = []
    $scope.filteredWords = [{word:"wef", fix: "123"},{word:"gbhg", fix: "4574575"},{word:"gbgnhy", fix: "8887687"}]

    $scope.reload = function () {
        // api.post('api/market').then(function (result) {
        //     $scope.words = result.words || []
        //     $scope.filteredWords = angular.copy($scope.words)
        // })
    }

    $scope.open = function (item) {
        dialog.open('replace', {
            word: item.word,
            fix: item.fix,
        })
    }

    $scope.reload()

})
