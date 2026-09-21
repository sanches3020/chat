var app = angular.module('app', ['ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages']);

app.controller('main', function ($scope, $http, $mdToast) {

    function post(url, data) {
        return $http.post(url, data, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    function dialogId() {
        return [$scope.message_sender_user_id, $scope.message_reciever_user_id]
            .sort()
            .join(":");
    }

    $scope.loadMessages = function () {
        post("api/dialog.php", { dialog_id: dialogId() })
            .then(res => $scope.messages = res.data);
    };

    $scope.new_message = function () {
        if (!$scope.message_text) return;

        post("api/send.php", {
            message_text: $scope.message_text,
            message_dialog_id: dialogId(),
            message_sender_user_id: $scope.message_sender_user_id,
            message_reciever_user_id: $scope.message_reciever_user_id
        })
            .then(res => {
                $scope.messages = res.data;
                $scope.message_text = '';
            });
    };

    $scope.reload = function () {
        const hash = localStorage.getItem("user_hash");
        if (!hash) return;

        post("api/users.php", { user_hash: hash })
            .then(res => $scope.users = res.data);

        post("api/profile.php", { user_hash: hash })
            .then(res => $scope.user = res.data);
    };

    $scope.reload();
    $scope.loadMessages();
});
