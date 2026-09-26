app.controller('profile', function ($scope, $location) {
    $scope.go = function (route) {
        $location.path(route);
    };
});