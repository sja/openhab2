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
	when('/setup', {templateUrl: 'partials/setup.html', controller: 'InboxController', title: 'Setup Wizard',}).
	when('/setup/search', {templateUrl: 'partials/setup.html', controller: 'InboxController', title: 'Setup Wizard',}).
	when('/setup/manual-setup/choose', {templateUrl: 'partials/setup.html', controller: 'ManualSetupChooseController', title: 'Setup Wizard',}).
	when('/setup/manual-setup/configure/:thingTypeUID', {templateUrl: 'partials/setup.html', controller: 'ManualSetupConfigureController', title: 'Setup Wizard',}).
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
}).run(['$location', '$rootScope', '$mdToast', function($location, $rootScope, $route, $mdToast) {
	var original = $location.path;
	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        $rootScope.path = $location.path().split('/');
        $rootScope.section = $rootScope.path[1];
        $rootScope.page = $rootScope.path[2];
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