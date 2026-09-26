var app = angular.module('app', ['ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'ui.router'])

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'app/views/home/index.html',
            controller: 'home',
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/profile/index.html',
            controller: 'profile',
        })
        .state('dialog', {
            url: '/dialog/:dialog_id',
            templateUrl: 'views/chats/index.html',
            controller: 'dialog',
        })

    $urlRouterProvider.otherwise('/market')

    $locationProvider.hashPrefix('')
})
