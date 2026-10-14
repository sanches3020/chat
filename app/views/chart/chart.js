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

function seriesOptions() {
    return {
        upColor: '#45be88',
        downColor: '#FF3347',
        borderUpColor: '#45be88',
        borderDownColor: '#FF3347',
        wickUpColor: '#45be88',
        wickDownColor: '#FF3347'
    }
}
