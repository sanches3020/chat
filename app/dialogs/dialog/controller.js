app.controller('dialog', function ($scope, api, toast, $mdDialog, dialog) {

    $scope.openChat = function (event) {
        dialog('login', 'dialogs/login', {}, event);
    }
})