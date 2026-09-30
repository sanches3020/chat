app.controller('profile', function ($scope, api, dialog) {
    addFormats($scope)

    $scope.send = function (event) {
        dialog('send', 'views/send', {}, event).then($scope.reload)
    }

    $scope.reload = function () {
        api.post('api/profile').then(function (result) {
            $scope.user = result.user
            $scope.stats = result.stats
        })
    }
    $scope.reload()
})
