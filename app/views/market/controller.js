app.controller('market', function ($scope, api, toast, dialog, sheet, $interval) {

    addFormats($scope)

    $scope.openChart = function (item, event) {
        dialog('chart', 'views/chart', {word: item.word}, event).then($scope.reload)
    }

    $scope.openFix = function () {
        sheet('fix', 'views/fix', {word: $scope.search_text}).then($scope.reload)
    }

    $scope.reload = function () {
        api.postSilent("api/words", {
            search_text: $scope.search_text,
        }).then(function (response) {
            $scope.words = response
            //$scope.openChart($scope.words[0])
        })
        api.postSilent("api/words_stats", {
            search_text: $scope.search_text,
        }).then(function (response) {
            $scope.stats = response
        })
    }
    $scope.reload()


    let interval = $interval($scope.reload, 1000)
    $scope.$on('$destroy', function () {
        $interval.cancel(interval)
    })

    $scope.clear = function () {
        $scope.search_text = ''
    }


    /*setTimeout(function () {
        $scope.openChart(response[0])
    }, 3000)*/

})
