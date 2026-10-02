app.controller('receive', function ($scope, api, toast, clipboard, $mdBottomSheet) {
    addFormats($scope)

    api.post('api/profile').then(function (result) {
        $scope.user_id = '@user' + result.user.user_id
    })

    $scope.close = function () {
        $mdBottomSheet.hide()
    }

    $scope.copy = function () {
        clipboard.write($scope.user_id).then(function (copied) {
            if (copied) {
                toast.success('ID скопирован')
                $scope.close()
            } else {
                toast.error('Не удалось')
            }
        })
    }
})
