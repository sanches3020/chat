var app = angular.module('app', ['ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'ui.router'])
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $stateProvider
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/profile/index.html',
            controller: 'profile',
        })
        .state('dialogs', {
            url: '/dialogs',
            templateUrl: 'views/dialogs/index.html',
            controller: 'dialogs',
        })
        .state('market', {
            url: '/market',
            templateUrl: 'views/market/index.html',
            controller: 'market',
        })

    $urlRouterProvider.otherwise('/dialogs')
    $locationProvider.hashPrefix('')

    $httpProvider.interceptors.push(() => ({
        request: (config) => {
            config.headers = config.headers || {}
            config.headers['token'] = localStorage.getItem('user_id')
            return config
        }
    }))
})