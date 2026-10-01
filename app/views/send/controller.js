app.controller('send', function ($scope, api, toast, $mdBottomSheet) {
    addFormats($scope)

    $scope.close = function () {
        $mdBottomSheet.hide()
    }

    $scope.send = function () {
        $mdBottomSheet.hide()
        /*api.post('api/transfer', {
            recipient_id: $scope.recipient_id,
            amount: $scope.amount
        }).then(function () {
            toast.success('Отправлено')
            $scope.success()
        })*/
    }
})
