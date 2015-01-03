angular.module('SmartHomeManagerApp.controllers.configuration', 
[]).controller('ConfigurationPageController', function($scope, $routeParams, $location) {
    $scope.currentTab = $routeParams.tab ? $routeParams.tab : 'bindings';
    $scope.action = $routeParams.action;
    $scope.args = [];
    $scope.args[0] = $routeParams.actionArg;
    $scope.tabs = [ 'bindings', 'groups', 'things' ];
    $scope.navigateTo = function(path) {
        $location.path('configuration/' + path);
    }
    $scope.getThingType = function(thingUID) {
        var segments = thingUID.split(':');
        var thingTypeUID = segments[0] + ':' + segments[1];
        if (!$scope.data.thingTypes) {
            return;
        }
        return $.grep($scope.data.thingTypes, function(thingType, i) {
            return thingTypeUID == thingType.UID;
        })[0];
    };
    $scope.getThingTypeUID = function(thingUID) {
        var segments = thingUID.split(':');
        return segments[0] + ':' + segments[1];
    };
}).controller('BindingController', function($scope, $mdDialog, bindingRepository) {
	$scope.refresh = function() {
		bindingRepository.getAll();	
	};
	$scope.openBindingInfoDialog = function(bindingId, event) {
		$mdDialog.show({
			controller : 'BindingInfoDialogController',
			templateUrl : 'partials/dialog.bindinginfo.html',
			targetEvent : event,
			hasBackdrop: true,
			locals: {bindingId: bindingId}
		});
	}
	bindingRepository.getAll();
}).controller('BindingInfoDialogController', function($scope, $mdDialog, bindingRepository, bindingId) {
	$scope.binding = undefined;
	bindingRepository.getOne(function(binding) {
		return binding.id === bindingId;
	}, function(binding) {
		$scope.binding = binding;
	});
	$scope.close = function() {
		$mdDialog.hide();
	}
}).controller('ThingController', function($scope, $timeout, thingTypeRepository, thingRepository) {
	
	thingTypeRepository.getAll();
	thingRepository.getAll();
	
	$scope.refresh = function() {
		thingRepository.getAll();	
	};
	
}).controller('ViewThingController', function($scope, $mdDialog, toastService, thingTypeRepository, thingRepository, thingSetupService) {
	
	var thingUID = $scope.args[0];
	var thingTypeUID = $scope.getThingTypeUID(thingUID);
	
	$scope.thing;
	$scope.thingType;
	$scope.edit = function(thing, event) {
		$mdDialog.show({
			controller : 'EditThingDialogController',
			templateUrl : 'partials/dialog.editthing.html',
			targetEvent : event,
			hasBackdrop: true,
			locals: {thing: thing}
		});
	};
	$scope.remove = function(thing, event) {
		var confirm = $mdDialog.confirm()
	      .title('Remove ' + thing.item.label)
	      .content('Would you like to remove the thing from the system?')
	      .ariaLabel('Remove Thing')
	      .ok('Remove')
	      .cancel('Cancel')
	      .targetEvent(event);
	    $mdDialog.show(confirm).then(function() {
	    	thingSetupService.remove({thingUID: thing.UID});
	    	toastService.showDefaultToast('Thing removed');
	    	$scope.navigateTo('things');
	    });
	};
	
    $scope.getChannelById = function(channelId) {
        if (!$scope.thingType) {
            return;
        }
        return $.grep($scope.thingType.channels, function(channel, i) {
            return channelId == channel.id;
        })[0];
    };
	
	thingRepository.getOne(function(thing) {
		return thing.UID === thingUID;
	}, function(thing) {
		$scope.thing = thing;
	});
	thingTypeRepository.getOne(function(thingType) {
		return thingType.UID === thingTypeUID;
	}, function(thingType) {
		$scope.thingType = thingType;
	});
}).controller('EditThingDialogController', function($scope, $mdDialog, thing, labelSetupService) {
	$scope.thing = thing;
	$scope.label = thing.item.label;
	$scope.save = function(label) {
		labelSetupService.setLabel({itemName: thing.item.name}, label);
		thing.item.label = label;
		$mdDialog.hide();
	}
	$scope.close = function() {
		$mdDialog.hide();
	}
});