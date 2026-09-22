var app = angular.module('app', ['ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages']);

app.controller('main', function ($scope, $http, $mdDialog) {

    function post(url, data) {
        return $http.post(url, data, {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    function dialogId() {
        return [$scope.user.user_id, $scope.activeChat.user_id]
            .sort()
            .join(":");
    }

    function selectFirstChat() {
        if ($scope.activeChat || !$scope.user || !$scope.users) return;

        var chat = $scope.users.find(function (user) {
            return user.user_id != $scope.user.user_id;
        });

        if (chat) $scope.selectChat(chat);
    }

    $scope.loadMessages = function () {
        if (!$scope.user || !$scope.activeChat) return;

        post("api/dialog.php", { dialog_id: dialogId() })
            .then(res => $scope.messages = res.data);
    };

    $scope.new_message = function () {
        if (!$scope.message_text || !$scope.user || !$scope.activeChat) return;

        post("api/send.php", {
            message_text: $scope.message_text,
            message_dialog_id: dialogId(),
            message_sender_user_id: $scope.user.user_id,
            message_reciever_user_id: $scope.activeChat.user_id
        })
            .then(() => {
                $scope.loadMessages();
                $scope.message_text = '';
            })
            .catch(() => $scope.loadMessages());
    };

    $scope.reload = function () {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        post("api/users.php", { user_id: userId })
            .then(res => {
                $scope.users = res.data;
                selectFirstChat();
            });

        post("api/profile.php", { user_id: userId })
            .then(res => {
                $scope.user = res.data;
                selectFirstChat();
            });
    };

    $scope.openLogin = function () {
        $mdDialog.show({
            templateUrl: "dialogs/login/index.html",
            controller: "login"
        });
    };

    $scope.getMatches = function (searchText) {
        var query = (searchText || '').toLowerCase();
        return ($scope.users || []).filter(function (user) {
            return (!$scope.user || user.user_id != $scope.user.user_id) &&
                String(user.user_name || '').toLowerCase().indexOf(query) !== -1;
        });
    };

    $scope.selectChat = function (user) {
        if (!user || !$scope.user || user.user_id == $scope.user.user_id) return;
        $scope.activeChat = user;
        $scope.loadMessages();
    };

    $scope.$watch('selectedItem', $scope.selectChat);

    $scope.reload();
});

