var app = angular.module('app', ['ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages']);

app.controller('main', function ($scope, api, dialog) {

    function dialogId() {
        return [$scope.user.user_id, $scope.activeChat.user_id].sort().join(":");
    }

    function selectFirstChat() {
        if ($scope.activeChat || !$scope.user || !$scope.users) return;
        var chat = $scope.users.find(u => u.user_id != $scope.user.user_id);
        if (chat) $scope.selectChat(chat);
    }

    $scope.loadMessages = function () {
        if (!$scope.user || !$scope.activeChat) return;

        api.post("api/dialog", { dialog_id: dialogId() })
            .then(data => $scope.messages = data);
    };

    $scope.new_message = function () {
        if (!$scope.message_text || !$scope.user || !$scope.activeChat) return;

        api.post("api/send", {
            message_text: $scope.message_text,
            message_dialog_id: dialogId(),
            message_sender_user_id: $scope.user.user_id,
            message_reciever_user_id: $scope.activeChat.user_id
        }).then(() => {
            $scope.loadMessages();
            $scope.message_text = '';
        }).catch(() => $scope.loadMessages());
    };

    $scope.reload = function () {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        api.post("api/users", { user_id: userId }).then(data => {
            $scope.users = data;
            selectFirstChat();
        });

        api.post("api/profile", { user_id: userId }).then(data => {
            $scope.user = data;
            selectFirstChat();
        });
    };

    $scope.openLogin = function (event) {
        dialog('login', 'dialogs/login', {}, event);
    };

    $scope.getMatches = function (searchText) {
        var query = (searchText || '').toLowerCase();
        return ($scope.users || []).filter(u =>
            (!$scope.user || u.user_id != $scope.user.user_id) &&
            String(u.user_name || '').toLowerCase().includes(query)
        );
    };

    $scope.selectChat = function (user) {
        if (!user || !$scope.user || user.user_id == $scope.user.user_id) return;
        $scope.activeChat = user;
        $scope.loadMessages();
    };

    $scope.$watch('selectedItem', $scope.selectChat);
    $scope.reload();
});
