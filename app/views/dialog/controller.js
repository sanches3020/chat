app.controller('dialog', function ($scope, $state, $stateParams, api) {
    $scope.dialog_id = $stateParams.dialog_id

    api.selectFile().then(function (file) {
        api.upload('api/upload', {}, file).then(function (result) {

        })
    })
})