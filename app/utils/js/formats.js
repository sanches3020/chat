function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randId() {
    return random(0, 999999999999)
}

const trunc = (num, digits = 0) => {
    const f = Math.pow(10, digits)
    return Math.trunc(num * f) / f
}

const round = (num, precision) => {
    const factor = Math.pow(10, precision != null ? precision : 4)
    return Math.round(num * factor) / factor
}


function getTime() {
    return new Date().toTimeString().split(' ')[0]
}

function toAttr(obj) {
    return Object.keys(obj)
        .map(function(key) {
            return encodeURIComponent(key) + '=' + (obj[key] !== undefined ? encodeURIComponent(obj[key]) : '')
        })
        .join('&')
}

function fromAttr(str) {
    return Object.fromEntries(new URLSearchParams(str))
}

function getAttr(str, key) {
    return Object.fromEntries(new URLSearchParams(str))[key]
}

function base64decode(base64) {
    return new TextDecoder().decode(Uint8Array.from(atob(base64), function (c) {
        return c.charCodeAt(0)
    }))
}

function addFormats($scope, $mdDialog) {

    $scope.in_progress = false
    $scope.dates = new Date().toISOString().split('T')[0]
    $scope.time = new Date().toLocaleString('sv-SE', {timeZone: 'Europe/Minsk'})

    $scope.queryParams = {}
    new URLSearchParams(window.location.search).forEach(function (value, key) {
        $scope.queryParams[key] = value
    })

    $scope.settings = {
        page: 1,
        size: 10,
    }

    $scope.random = function (min, max) {
        return random(min, max)
    }

    $scope.randId = function () {
        return randId()
    }

    $scope.filter = function (array, field, query) {
        if (typeof query === 'string') {
            query = query.toLowerCase()
            return array.filter(i => i[field].toLowerCase().includes(query))
        }
        return []
    }

    $scope.sorted = function (fieldName) {
        if ($scope.settings.order_by === fieldName) {
            if ($scope.settings.order_to === 'asc') {
                return {'asc': true}
            } else {
                return {'desc': true}
            }
        }
        return ''
    }

    $scope.order = function (fieldName) {
        if ($scope.settings.order_by === fieldName) {
            $scope.settings.order_to = $scope.settings.order_to === 'asc' ? 'desc' : 'asc'
        } else {
            $scope.settings.order_by = fieldName
            $scope.settings.order_to = 'asc'
        }
        $scope.reload()
    }

    $scope.stop = function ($event) {
        $event.stopPropagation()
    }

    $scope.onDatesChange = function (date) {
        $scope.datesSetByUser = true
        let dates = date.split(' — ')
        if (dates.length === 2) {
            $scope.settings.date_from = dates[0]
            $scope.settings.date_to = dates[1]
        } else {
            $scope.settings.date_from = dates[0]
            $scope.settings.date_to = dates[0]
        }
        $scope.reload()
    }

    $scope.formatDatetime = function (value) {
        if (value == null) return ''
        let d = new Date(value)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        const h = String(d.getHours()).padStart(2, '0')
        const i = String(d.getMinutes()).padStart(2, '0')
        return `${dd}.${m}.${y} ${h}:${i}`
    }

    $scope.formatTime = function (value) {
        if (value == null) return ''
        let d = new Date(value)
        const h = String(d.getHours()).padStart(2, '0')
        const i = String(d.getMinutes()).padStart(2, '0')
        return `${h}:${i}`
    }

    $scope.formatDate = function (value) {
        if (value == null) return ''
        let d = new Date(value)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        return `${dd}.${m}.${y}`
    }

    $scope.round = function (num, precision) {
        const factor = Math.pow(10, precision != null ? precision : 4)
        return Math.floor(num * factor) / factor
    }

    $scope.formatCount = function (number, precision) {
        if (typeof number === 'string')
            number = parseFloat(number)
        if (typeof number === 'number' && !isNaN(number)) {
            if (number === 0) return '0'
            return $scope.round(number, precision).toLocaleString('en', {
                minimumFractionDigits: 0,
                maximumFractionDigits: precision || 2
            })
        }
        return '0'
    }

    $scope.currency = function () {
        return ''
    }

    $scope.formatPrice = function (number, precision = 2) {
        return $scope.formatCount(number, precision) + ' ' + $scope.currency()
    }

    $scope.formatAmount = function (number, measure, precision = 3) {
        if (measure === 'recipe')
            //return $scope.measures[measure]
            return $scope.formatCount(number, precision) + ' ' + $scope.measures['item']
        else
            return $scope.formatCount(number, precision) + ' ' + $scope.measures[measure]
    }

    $scope.formatPercent = function (number, precision) {
        if (number == 0 || isNaN(number) || number == null) return "0%"
        return $scope.round(number, precision || 2) + "%"
    }

    $scope.percentColor = function (number) {
        if (number === undefined) return ""
        if (number > 0) return {'text-green': true}
        return {'text-red': true}
    }

    $scope.priceColor = function (value) {
        if (!value) return {'text-gray': true}
        if (value > 0) return {'text-green': true}
        return {'text-red': true}
    }

    $scope.stringToColor = function (str) {
        if (str == null) return 'var(--black)'
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let r = (hash & 0xFF0000) >> 16;
        let g = (hash & 0x00FF00) >> 8;
        let b = hash & 0x0000FF;
        r = Math.abs(r % 256);
        g = Math.abs(g % 256);
        b = Math.abs(b % 256);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    if ($mdDialog) {
        $scope.close = function () {
            $mdDialog.cancel()
        }
        $scope.success = function (result) {
            $scope.in_progress = true
            setTimeout(function () {
                $mdDialog.hide(result)
            }, 100)
        }

        $scope.page = 0
        $scope.goToPage = function (pageIndex) {
            $scope.page = pageIndex
        }
    }
}

function clone(array) {
    return array ? JSON.parse(JSON.stringify(array)) : null
}
