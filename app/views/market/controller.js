app.controller('market', function ($scope, api, toast, dialog) {

    addFormats($scope)

    $scope.openChart = function (item) {
        dialog('chart', 'views/chart', {
            word: item.word
        })
    }

    $scope.reload = function () {
        api.post("api/words", {
            search_text: $scope.search_text,
        }).then(function (response) {
            $scope.words = response
        })
    }
    $scope.reload()

    /*setTimeout(function () {
        $scope.openChart(response[0])
    }, 3000)*/

})
