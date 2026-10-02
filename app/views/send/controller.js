app.controller('send', function ($scope, api, loader, toast, clipboard, $mdBottomSheet) {
    addFormats($scope)
    let load = loader($scope)

    api.post('api/profile').then(function (result) {
        $scope.user = result.user
    })

    $scope.close = function () {
        $mdBottomSheet.hide()
    }

    $scope.pasteRecipient = function () {
        clipboard.read().then(function (text) {
            $scope.recipient_id = text
        })
    }

    $scope.send = function () {
        load.post('api/transfer', {
            recipient_id: $scope.recipient_id.replace(/\D/g, ''),
            amount: $scope.amount
        }).then(function () {
            toast.success('Отправлено')
            $scope.close()
        })
    }
})
