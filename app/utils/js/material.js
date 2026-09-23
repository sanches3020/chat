app.service('toast', function ( $mdToast) {
    function showMessage(message, styleClass = 'red-toast') {
        if (message == null) message = 'Ошибка'
        let spaceCount = message.split(' ').length + 1
        let delay = spaceCount / 4 * 1000
        if (delay < 2000) delay = 2000
        $mdToast.show($mdToast.simple()
            .toastClass(styleClass)
            .position('top right')
            .textContent(message)
            .hideDelay(delay))
    }

    this.success = function (message = 'Сохранено') {
        showMessage(message, 'green-toast')
    }

    this.error = function (message) {
        showMessage(message, 'red-toast')
    }
})
app.service('api', function ($http, $q, toast) {

    function prepareUrl(url) {
        if (url.endsWith('.php'))
            url = url.slice(0, -4)
        if (url.startsWith('/'))
            url = url.substring(1)
        if (!url.startsWith('http'))
            url = '/' + url
        return url + '.php'
    }

    function unwrap(response) {
        return response.data
    }

    this.get = function (url, params) {
        url = prepareUrl(url)
        return $http.get(url, {params: Object.assign({}, params)})
            .then(unwrap)
            .catch(catchError)
    }
    this.post = function (url, data, params) {
        url = prepareUrl(url)
        return $http.post(url, data, {params: Object.assign({}, params)})
            .then(unwrap)
            .catch(catchError)
    }
    this.postSilent = function (url, data, params) {
        url = prepareUrl(url)
        return $http.post(url, data, {params: Object.assign({}, params)})
            .then(unwrap)
    }

    function catchError(response) {
        toast.error(response.data?.message)
        return $q.reject(response)
    }

    this.all = function (requests) {
        return $q.all(requests)
    }

    this.download = function (url, data) {
        url = prepareUrl(url)
        return $http.post(url, data, {
            responseType: 'blob'
        }).then(unwrap)
    }

    this.selectFile = function (accept = '.jpg,.jpeg,.png') {
        var deferred = $q.defer()
        var input = document.createElement('input')
        input.type = 'file'
        input.style.display = 'none'
        input.accept = accept
        document.body.appendChild(input)
        input.onchange = function () {
            if (!input.files || input.files.length === 0) {
                deferred.reject('Файл не выбран')
                document.body.removeChild(input)
                return
            }
            deferred.resolve(input.files[0])
            document.body.removeChild(input)
        }
        input.click()
        return deferred.promise
    }

    this.upload = function (url, headers, data) {
        url = prepareUrl(url)
        var blob = new Blob([data], {type: 'application/octet-stream'})
        return $http.post(url, blob, {
            transformRequest: angular.identity,
            headers
        }).then(unwrap)
            .catch(catchError)
    }

})

app.factory('dialog', function ($mdDialog) {
    return function (controller, template, params, event) {

        return $mdDialog.show({
            controller: controller,
            templateUrl: template + '/index.html',
            targetEvent: event || null,
            focusOnOpen: false,
            clickOutsideToClose: true,
            multiple: true,
            locals: {
                params: params || {}
            }
        })
    }
})

app.directive('decimalNumbers', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var limit = parseInt(attrs.decimalNumbers) || 0
            var patternString = limit > 0
                ? '^\\d+(\\.\\d{1,' + limit + '})?$'
                : '^\\d+$'
            var regex = new RegExp(patternString)
            var allowed = '0123456789.,'
            element.on('input', function () {
                var value = element.val()
                var clean = ''
                for (var i = 0; i < value.length; i++) {
                    var ch = value[i]
                    if (allowed.indexOf(ch) !== -1) {
                        if (ch === '.' || ch === ',') {
                            if (clean.indexOf('.') === -1) {
                                clean += clean === '' ? '0.' : '.'
                            }
                        } else {
                            clean += ch
                        }
                    }
                }
                if (limit > 0) {
                    var dotIndex = clean.indexOf('.')
                    if (dotIndex !== -1 && clean.length > dotIndex + 1 + limit) {
                        clean = clean.substring(0, dotIndex + 1 + limit)
                    }
                }
                if (clean !== value) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(clean)
                        ngModel.$render()
                    })
                }
            })

            ngModel.$validators.numberDecimals = function (modelValue, viewValue) {
                var value = modelValue || viewValue
                if (!value) return true
                return regex.test(value.toString())
            }
        }
    }
})

app.service('cache', function () {
    return {
        get: function (key) {
            try {
                const item = localStorage.getItem(key)
                return item ? JSON.parse(item) : null
            } catch (e) {
                return null
            }
        },
        set: function (key, data) {
            const raw = JSON.stringify(data)
            localStorage.setItem(key, raw)
            return data
        },
        updated: function (key, newData) {
            return localStorage.getItem(key) === JSON.stringify(newData)
        }
    }
})