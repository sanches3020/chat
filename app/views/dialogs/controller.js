app.controller('dialogs', function ($scope, $state, api, dialog) {

    addFormats($scope)

    $scope.openDialog = function (dialog_id, event) {
        dialog('dialog', 'dialogs/dialog', {
            dialog_id: dialog_id
        }, event)
    }

    api.post('api/dialogs').then(function (result) {
        $scope.dialogs = result
        $scope.openDialog($scope.dialogs[0].dialog_id)
    })
})