app.controller('invite', function ($scope, api, loader, toast, $mdBottomSheet) {
    addFormats($scope)
    let load = loader($scope)

    $scope.close = function () {
        $mdBottomSheet.hide()
    }

    $scope.reload = function () {
        api.post('api/dialog_title').then(function (result) {
            $scope.dialog_title = result.dialog_title
        })
    }

    $scope.reload()

    $scope.invite = function () {
        load.post('api/dialog_insert', {
            dialog_title: $scope.dialog_title,
            dialog_style: $scope.dialog_style,
        }).then(function (result) {
            toast.success('Диалог создан')
            $scope.close(result.dialog_id)
        })
    }

    $scope.randomStyle = function () {
        api.post('api/sentence_style_random').then(function (result) {
            $scope.dialog_style = result
        })
    }
})
