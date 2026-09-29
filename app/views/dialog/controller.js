app.controller('dialog', function ($scope, api, toast, $mdDialog, dialog, params) {

    addFormats($scope, $mdDialog)

    $scope.reload = function () {
        api.post('api/dialog', {
            dialog_id: params.dialog_id
        }).then(function (result) {
            $scope.dialog = result.dialog
            $scope.messages = result.messages

            $scope.openDialog($scope.dialogs[0].dialog_id)
        })
    }
    $scope.reload()


    $scope.send = function () {
        api.post('api/send', {
            dialog_id: params.dialog_id,
            message_text: $scope.message_text,
        }).then(function () {
            $scope.message_text = ''
            $scope.reload()
        })
    }
})