app.controller('invite', function ($scope, api, toast, $mdDialog, dialog) {
    addFormats($scope, $mdDialog)

    $scope.reload = function () {
        api.post('api/dialog_title').then(function (result) {
            $scope.dialog_title = result.dialog_title
        })
    }

    $scope.reload()

    $scope.invite = function () {
        api.post('api/dialog_insert', {
            dialog_title: $scope.dialog_title
        }).then(function (result) {
           $scope.success()
        })
    }
})