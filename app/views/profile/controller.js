app.controller('profile', function ($scope, api) {

    addFormats($scope)

    $scope.user =
        {
            user_balance: 1000000,
        }


    $scope.assets = [
        {
            symbol: 'T',
            name: 'Монеты',
            description: 'Баланс аккаунта',
            amount: '',
            value: 'T69',
        }
    ]

    $scope.reload = function () {
        api.post('api/user').then(function (result) {
            $scope.user = result
            $scope.assets[0].amount = $scope.formatCount(result.user_balance)
        })
    }

    $scope.send = function () {}
    $scope.addFunds = function () {}
    $scope.swap = function () {}

    $scope.reload()

})
