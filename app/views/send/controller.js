app.controller('send', function ($scope, api, toast, $mdDialog) {
    addFormats($scope, $mdDialog)

    $scope.send = function () {
        api.post('api/transfer', {
            recipient_id: $scope.recipient_id,
            amount: $scope.amount
        }).then(function () {
            toast.success('Отправлено')
            $scope.success()
        })
    }
})
