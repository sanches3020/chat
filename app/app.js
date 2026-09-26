var app = angular.module('app', ['ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'ui.router'])
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('dialogs', {
            url: '/dialogs',
            templateUrl: 'views/dialogs/index.html',
            controller: 'dialogs',
        })
        .state('dialog', {
            url: '/dialog/:dialog_id',
            templateUrl: 'views/dialog/index.html',
            controller: 'dialog',
        })
        .state('subs', {
            url: '/subs',
            templateUrl: 'views/subs/index.html',
            controller: 'subs',
        })
        .state('market', {
            url: '/market',
            templateUrl: 'views/market/index.html',
            controller: 'market',
        })
    $urlRouterProvider.otherwise('/dialogs')
    $locationProvider.hashPrefix('')
})