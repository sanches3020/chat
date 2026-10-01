app.controller('analytics', function ($scope, api, toast, $mdDialog, dialog, params) {
    addFormats($scope, $mdDialog)

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

    $scope.periods = ['S', 'M', 'H', 'D']
    $scope.period_names = {
        'S': 'C',
        'M': 'M',
        'H': 'Ч',
        'D': 'Д',
    }
    $scope.period_name = "M"
    $scope.setPeriod = function (period_name) {
        $scope.period_name = period_name || $scope.period_name
        api.post("api/event_chart", {
            key: params.key,
            period_name: $scope.period_name
        }).then(function (response) {
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

})
