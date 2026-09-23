app.controller('login', function ($scope, api, toast, cache, $mdDialog) {

    $scope.user_telegram_chat_id = '';

    $scope.close = function () {
        $mdDialog.hide();
    };

    $scope.enter = function () {
        api.post("api/login", {
            user_telegram_chat_id: $scope.user_telegram_chat_id,
        }).then(function (data) {

            cache.set("user_id", data.user_id);
            cache.set("user_telegram_chat_id", $scope.user_telegram_chat_id);

            toast.success("Успешный вход");

            $mdDialog.hide();
            location.reload();
        });
    };
});
