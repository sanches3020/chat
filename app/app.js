var app = angular.module('app', ['ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'ui.router'])

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('subs', {
            url: '/subs',
            templateUrl: 'app/views/subs/index.html',
            controller: 'subs',
        })
        .state('market', {
            url: '/market',
            templateUrl: 'views/market/index.html',
            controller: 'market',
        })
        .state('dialog', {
            url: '/dialog/:dialog_id',
            templateUrl: 'views/chats/index.html',
            controller: 'dialog',
        })

    $urlRouterProvider.otherwise('/subs')

    $locationProvider.hashPrefix('')
})
