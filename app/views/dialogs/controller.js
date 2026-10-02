app.controller('dialogs', function ($scope, $state, api, dialog, sheet) {
    addFormats($scope)

    $scope.openDialog = function (dialog_id, event) {
        dialog('dialog', 'views/dialog', {
            dialog_id: dialog_id
        }, event)
    }

    $scope.reload = function () {
        api.post('api/dialogs').then(function (result) {
            $scope.dialogs = result
            /*dialog('chart', 'dialogs/chart', {

            })*/
        })
    }

    $scope.reload()

    $scope.openInvite = function (event) {
        sheet('invite', 'views/invite', {}, event).then($scope.reload)
    }
})