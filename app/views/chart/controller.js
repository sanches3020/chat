function getChartOptions() {
    return {
        layout: {
            background: {color: '#222'},
            textColor: '#DDD'
        },
        grid: {
            vertLines: {color: '#444'},
            horzLines: {color: '#444'}
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal
        },
        localization: {
            timeFormatter: (time) => {
                if (typeof time === 'number') {
                    let date = new Date(time * 1000);
                    return date.toLocaleTimeString([], {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        year: '2-digit'
                    });
                }
                return String(time);
            },
            priceFormatter: (price) => {
                if (price == null || isNaN(price)) return ''
                if (price >= 1) {
                    return price.toFixed(2)
                } else {
                    return price.toFixed(4)
                }
            }
        }
    }
}

function chartResize(tradeChart, chart) {
    new ResizeObserver(entries => {
        if (entries.length === 0 || entries[0].target !== tradeChart) return
        const newRect = entries[0].contentRect
        chart.applyOptions({height: newRect.height, width: newRect.width})
    }).observe(tradeChart)
}

function createChart(id) {
    var element = document.getElementById(id)
    element.id = id + Math.floor(Math.random() * 10000)
    var chart = LightweightCharts.createChart(element, getChartOptions())
    chartResize(element, chart)
    return chart
}


app.controller('chart', function ($scope, api, toast, $mdDialog, dialog, params) {
    addFormats($scope, $mdDialog)

    function init() {
        setTimeout(function () {
            if ($scope.candleSeries == null) {
                let chart = createChart("chart")
                $scope.candleSeries = chart.addCandlestickSeries({
                    upColor: '#45be88',
                    downColor: '#FF3347',
                    borderUpColor: '#45be88',
                    borderDownColor: '#FF3347',
                    wickUpColor: '#45be88',
                    wickDownColor: '#FF3347'
                })
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
            key: params.word,
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


    api.post("api/fixes", {word: params.word}).then(function (response) {
        $scope.fixes = response
    })

    $scope.buy = function () {
        $scope.close()
    }

})
