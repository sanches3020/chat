app.controller('subs', function ($scope, $state, api) {

    $scope.openDialog = function () {
        $state.go('subs', {
            dialog_id: 123
        })
    }


    api.post('api/user', {user_id: 123}).then(function (result) {
        $scope.uesr = result.user
    })
})