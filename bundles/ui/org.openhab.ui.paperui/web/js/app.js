angular.module('SmartHomeManagerApp', [
  'SmartHomeManagerApp.controllers',
  'SmartHomeManagerApp.controllers.setup',
  'SmartHomeManagerApp.controllers.configuration',
  'SmartHomeManagerApp.services',
  'SmartHomeManagerApp.services.rest',
  'SmartHomeManagerApp.services.repositories',
  'ngRoute',
  'ngResource',
  'ngMaterial'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.
	when('/control', {templateUrl: 'partials/control.html', controller: 'ControlPageController', title: 'Control',}).
	when('/control/:tab', {templateUrl: 'partials/control.html', controller: 'ControlPageController', title: 'Control',}).
	when('/inbox', {templateUrl: 'partials/setup.html', controller: 'SetupPageController', title: 'Setup Wizard',}).
	when('/inbox/:tab', {templateUrl: 'partials/setup.html', controller: 'SetupPageController', title: 'Setup Wizard',}).
	when('/inbox/:tab/:action', {templateUrl: 'partials/setup.html', controller: 'SetupPageController', title: 'Setup Wizard',}).
	when('/inbox/:tab/:action/:arg1', {templateUrl: 'partials/setup.html', controller: 'SetupPageController', title: 'Setup Wizard',}).
	when('/configuration', {templateUrl: 'partials/configuration.html', controller: 'ConfigurationPageController', title: 'Configuration'}).
	when('/configuration/:tab', {templateUrl: 'partials/configuration.html', controller: 'ConfigurationPageController', title: 'Configuration'}).
	when('/configuration/:tab/:action', {templateUrl: 'partials/configuration.html', controller: 'ConfigurationPageController', title: 'Configuration'}).
	when('/configuration/:tab/:action/:actionArg', {templateUrl: 'partials/configuration.html', controller: 'ConfigurationPageController', title: 'Configuration'}).
	when('/preferences', {templateUrl: 'partials/preferences.html', controller: 'PreferencesPageController', title: 'Preferences'}).
	otherwise({redirectTo: '/control'});
}]).directive('editableitemstate', function(){
    return function($scope, $element) {
        $element.context.addEventListener('focusout', function(e){
            $scope.sendCommand($($element).html());
        });
    };
}).run(['$location', '$rootScope', '$mdToast', function($location, $rootScope, $mdToast) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
    $rootScope.asArray = function (object) {
        return $.isArray(object) ? object : object ? [ object ] : [] ;
    }

    $rootScope.data = [];
    $rootScope.navigateToRoot = function() {
        $location.path('');
    }
    $rootScope.navigateFromRoot = function(path) {
        $location.path(path);
    }
}]);