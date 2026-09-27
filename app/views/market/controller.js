app.controller('market', function ($scope, api, toast, $mdDialog, dialog, params) {

    addFormats($scope, $mdDialog)

    $scope.mems = []
    $scope.filteredMems = []

    $scope.reload = function () {

        api.post('api/market').then(function (result) {

            $scope.mems = result.mems || []
            $scope.filteredMems = angular.copy($scope.mems)

        })

    }

    $scope.getMatches = function (text) {

        if (!$scope.mems) {
            return []
        }

        if (!text) {
            $scope.filteredMems = angular.copy($scope.mems)
            return $scope.mems
        }

        var query = text.toLowerCase().trim()

        var result = $scope.mems.filter(function (item) {

            return item.mem_title &&
                item.mem_title.toLowerCase().includes(query)

        })

        $scope.filteredMems = result

        return result
    }

    $scope.open = function (item) {

        dialog.open('mem', {
            mem_id: item.mem_id
        })

    }

    $scope.reload()

})
