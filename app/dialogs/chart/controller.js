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
    var tradeChart = document.getElementById(id)
    tradeChart.id = id + Math.floor(Math.random() * 10000)
    var chart = LightweightCharts.createChart(tradeChart, getChartOptions())
    chartResize(tradeChart, chart)
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
                $scope.accomulateSeries = chart.addHistogramSeries({
                    color: '#45be88',
                    priceFormat: {
                        type: 'volume'
                    },
                    priceScaleId: ''
                })
                $scope.accomulateSeries.priceScale().applyOptions({
                    scaleMargins: {
                        top: 0.9,
                        bottom: 0
                    }
                })
            }
            $scope.setPeriod($scope.period_name)
        }, !window.chartLoaded ? 300 : 0)
        window.chartLoaded = true
    }

    init()

    $scope.periods = ['M', 'H', 'D']
    $scope.period_names = {
        'M': 'M',
        'H': 'Д',
        'D': 'Г',
    }
    $scope.period_name = "D"
    $scope.setPeriod = function (period_name) {
        $scope.period_name = period_name || $scope.period_name
        api.post("api/event_chart", {
            key: 'wef',
            accumulate_key: 'wef',
            period_name: $scope.period_name
        }).then(function (response) {
            response = {
                candles: [
                    {
                        time: 1774872000,
                        open: 100.5,
                        high: 105.2,
                        low: 99.1,
                        close: 103.4
                    },
                    {
                        time: 1774958400,
                        open: 103.4,
                        high: 108.0,
                        low: 102.5,
                        close: 101.2
                    }
                ],
                accumulate: [
                    {
                        time: 1774872000,
                        value: 1500,
                        color: '#45be88'
                    },
                    {
                        time: 1774958400,
                        value: 2100,
                        color: '#45be88'
                    }
                ]
            }
            if (response.candles != null) {
                $scope.candleSeries.setData(response.candles)
                for (const volume of response.accumulate) {
                    for (const candle of response.candles) {
                        if (candle.time == volume.time) {
                            if (candle.open > candle.close)
                                volume.color = "#FF3347"
                            break
                        }
                    }
                }
                $scope.accomulateSeries.setData(response.accumulate)
                $scope.showNoData = false
            } else {
                $scope.showNoData = true
            }
        })
    }

    api.post("api/fixes", {word: params.word}).then(function (response) {
        $scope.fixes = response
    })

    $scope.buy = function () {
        $scope.close()
    }

})
