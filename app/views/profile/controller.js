app.controller('profile', function ($scope, api, dialog, sheet, toast, clipboard, $interval) {
    addFormats($scope)

    $scope.openChart = function (item, event) {
        dialog('chart', 'views/chart', {word: item.word}, event)
    }

    $scope.send = function (event) {
        sheet('send', 'views/send', {}, event).then($scope.reload)
    }

    $scope.addFunds = function (event) {
        sheet('receive', 'views/receive', {}, event).then($scope.reload)
    }

    $scope.openEdit = function (event) {
        sheet('edit', 'views/edit', {user_name: $scope.user && $scope.user.user_name}, event)
            .then($scope.reload)
    }

    $scope.openAnalytics = function () {
        dialog('analytics', 'views/analytics', {key: "app_start"})
    }

    $scope.openBalance = function (event) {
        dialog('analytics', 'views/analytics', {key: balanceKey()}, event)
    }

    $scope.openSupport = function (event) {
        dialog('dialog', 'views/dialog', {dialog_id: 1}, event)
    }

    $scope.copyId = function () {
        clipboard.write('@user' + ($scope.user ? $scope.user.user_id : '')).then(function (copied) {
            copied ? toast.success('ID скопирован') : toast.error('Не удалось')
        })
    }

    function balanceKey() {
        let user_id = $scope.user ? $scope.user.user_id : localStorage.getItem('user_id')
        return 'balance_' + user_id
    }

    $scope.reload = function () {
        api.postSilent('api/profile').then(function (result) {
            $scope.user = result.user
            $scope.stats = result.stats
        })
    }
    $scope.reload()

    let interval = $interval($scope.reload, 1000)
    $scope.$on('$destroy', function () {
        $interval.cancel(interval)
    })

    $scope.openDialog = function (dialog_id, event) {
        dialog('dialog', 'views/dialog', {dialog_id: dialog_id}, event)
    }

    $scope.openInvite = function (event) {
        sheet('invite', 'views/invite', {}, event).then($scope.openDialog)
    }
})
