app.controller('edit', function ($scope, api, loader, toast, $mdBottomSheet, params) {
    addFormats($scope)
    let load = loader($scope)

    $scope.user_name = params.user_name

    $scope.close = function () {
        $mdBottomSheet.hide()
    }

    $scope.save = function () {
        load.update('api/user_update', {user_name: $scope.user_name}).then($scope.close)
    }
})
