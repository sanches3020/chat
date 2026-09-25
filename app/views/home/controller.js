app.controller('home', function ($scope, $state, api) {

    $scope.openDialog = function () {
        $state.go('dialog', {
            dialog_id: 123
        })
    }


    api.post('api/user', {user_id: 123}).then(function (result) {
        $scope.uesr = result.user
    })
})