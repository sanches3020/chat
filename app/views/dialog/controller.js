app.controller('dialog', function ($scope, api, toast, $mdDialog, dialog, sheet, params) {

    addFormats($scope, $mdDialog)

    $scope.user_id = localStorage.getItem('user_id')

    function markGroups(messages) {
        for (let i = 0; i < (messages || []).length; i++) {
            let prev = messages[i - 1]
            let next = messages[i + 1]
            messages[i].group_start = !prev || prev.user_id != messages[i].user_id
            messages[i].group_end = !next || next.user_id != messages[i].user_id
            messages[i].grouped = !messages[i].group_start || !messages[i].group_end
        }
        return messages
    }

    $scope.reload = function () {
        api.post('api/dialog', {
            dialog_id: params.dialog_id
        }).then(function (result) {
            $scope.dialog = result.dialog
            $scope.messages = markGroups(result.messages)
        })
    }
    $scope.reload()

    $scope.invite = function (event) {
        sheet('share', 'views/share', {
            dialog_id: params.dialog_id,
            dialog_title: $scope.dialog && $scope.dialog.dialog_title
        }, event)
    }

    $scope.send = function () {
        api.post('api/send', {
            dialog_id: params.dialog_id,
            message_text: $scope.message_text,
        }).then(function () {
            $scope.message_text = ''
            $scope.reload()
        })
    }
})
