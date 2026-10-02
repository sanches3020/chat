const BOT_USERNAME = 'haiters_army'

app.controller('share', function ($scope, params, api, loader, toast, clipboard, $mdBottomSheet) {
    addFormats($scope)
    let load = loader($scope)

    $scope.link = 'https://t.me/' + BOT_USERNAME + '?start=' + params.dialog_id

    api.post('api/dialog', {
        dialog_id: params.dialog_id
    }).then(function (result) {
        $scope.dialog_title = result.dialog.dialog_title
    })

    $scope.close = function () {
        $mdBottomSheet.hide()
    }

    $scope.copy = function () {
        clipboard.write($scope.link).then(function (copied) {
            if (copied) {
                toast.success('Ссылка скопирована')
            } else {
                toast.error('Не удалось')
            }
        })
    }

    $scope.share = function () {
        if (!Telegram.WebApp.initData) return $scope.copy()

        Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent($scope.link) +
            '&text=' + encodeURIComponent('Приглашение в чат ' + ($scope.dialog_title ? ' «' + $scope.dialog_title + '»' : '')))
    }
})
