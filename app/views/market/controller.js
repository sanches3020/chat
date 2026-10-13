app.controller('market', function ($scope, api, toast, dialog, sheet, $interval, $http) {

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
            $scope.updatePrices()
        })
    }
    $scope.reload()

    $scope.updatePrices = function () {
        if (!$scope.words || !$scope.words.length) return
        const words = $scope.words.map(item => item.word).join(",")
        $http.get(location.origin.replace("chat.", "chart.") + "/prices", {
            params: {words: words}
        }).then(function (response) {
            response.data.forEach(item => {
                const word = $scope.words.find(word => word.word === item.word)
                if (word) {
                    word.price = item.price
                    word.price24 = item.price24
                }
            })
        })
    }

    let priceTimer = $interval($scope.updatePrices, 1000)
    $scope.$on('$destroy', function () {
        $interval.cancel(priceTimer)
    })

    $scope.clear = function () {
        $scope.search_text = ''
    }

})
