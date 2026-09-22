app.controller('login', function ($scope, $http, $mdToast, $mdDialog) {

    $scope.user_telegram_chat_id = '';

    $scope.close = function () {
        $mdDialog.hide()
    }

    $scope.enter = async function () {
        $http.post("api/login.php", {
            user_telegram_chat_id: $scope.user_telegram_chat_id,
        }).then(function (response) {

            localStorage.setItem("user_id", response.data.user_id)
            localStorage.setItem("user_telegram_chat_id", $scope.user_telegram_chat_id)

            $mdToast.show(
                $mdToast.simple().textContent("Успешный вход").hideDelay(3000)
            )

            $mdDialog.hide()
            location.reload()

        }).catch(function (error) {
            $mdToast.show(
                $mdToast.simple().textContent(error.data.message || 'Ошибка входа').hideDelay(3000)
            )
        })
    }
})
