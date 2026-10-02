app.controller('profile', function ($scope, api, dialog, sheet) {
    addFormats($scope)

    $scope.openChart = function (item, event) {
        dialog('chart', 'views/chart', {word: item.word}, event)
    }

    $scope.send = function (event) {
        sheet('send', 'views/send', {}, event).then($scope.reload)
    }

    $scope.addFunds = function (event) {
        sheet('receive', 'views/receive', {}, event).then($scope.reload)
    }

    $scope.openEdit = function (item, event) {
        localStorage.clear()
    }

    $scope.openAnalytics = function () {
        dialog('analytics', 'views/analytics', {key: "app_start"})
    }

    $scope.reload = function () {
        api.post('api/profile').then(function (result) {
            $scope.user = result.user
            $scope.stats = result.stats
        })
    }
    $scope.reload()
})
