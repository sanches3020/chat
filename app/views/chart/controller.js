app.controller('chart', function ($scope, api, toast, $mdDialog, sheet, params, $http) {
    addFormats($scope, $mdDialog)

    $scope.word = params.word

    function init() {
        setTimeout(function () {
            if ($scope.candleSeries == null) {
                let chart = createChart("chart")
                $scope.candleSeries = chart.addCandlestickSeries(seriesOptions())
            }
            $scope.setPeriod($scope.period_name)
        }, !window.chartLoaded ? 300 : 0)
        window.chartLoaded = true
    }

    init()

    $scope.periods = ['M', 'H', 'D']
    $scope.period_names = {
        'M': 'M',
        'H': 'Ч',
        'D': 'Д',
    }
    $scope.period_name = "M"
    $scope.setPeriod = function (period_name) {
        $scope.period_name = period_name || $scope.period_name
        $http.get(botHost() + "/chart", {
            params: {
                key: "word_" + params.word,
                period: $scope.period_name
            }
        }).then(response => response.data).then(function (response) {
            if (response.length > 0) {
                $scope.candleSeries.setData(response.map(i => {
                    return {
                        time: i.time,
                        open: i.open,
                        close: i.close,
                        low: i.low,
                        high: i.high,
                    }
                }))
                $scope.showNoData = false
            } else {
                $scope.showNoData = true
            }
        })
    }

    let interval = setInterval($scope.setPeriod, 1000)
    $scope.$on('$destroy', function () {
        clearInterval(interval)
    })

    api.post("api/event_stats", {key: "word_" + params.word}).then(function (response) {
        $scope.stats = response
    })

    api.post("api/fixes", {word: params.word}).then(function (response) {
        $scope.fixes = response
    })

    $scope.buy = function () {
        sheet('fix', 'views/fix', {})
    }

})
