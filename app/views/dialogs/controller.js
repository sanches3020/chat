app.controller('dialogs', function ($scope, $state, api) {

    addFormats($scope)

    $scope.openDialog = function (dialog_id) {
        dialog('dialog', 'dialogs/dialog', {
            dialog_id: dialog_id
        })
    }

    api.post('api/dialogs').then(function (result) {
        $scope.dialogs = result
    })

})