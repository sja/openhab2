angular.module('SmartHomeManagerApp.controllers', []).controller('BodyController', function($scope, eventService, toastService) {
    $scope.getSchemeClass = function() {
        var theme = localStorage.getItem('theme');
        if (theme) {
            return 'theme-' + theme;
        } else {
            return 'theme-openhab';
        }
    }
    $scope.isEshTheme = function() {
        return $scope.getSchemeClass() === 'theme-white';
    }

    var numberOfInboxEntries = -1;
    eventService.onEvent('smarthome/inbox/added/*', function(topic, discoveryResult) {
    	toastService.showDefaultToast('New Inbox Entry: ' + discoveryResult.label, 'Show Inbox', 'inbox');
	});
}).controller('ControlPageController', function($scope, $routeParams, $location, $timeout, itemService) {
    $scope.items = [];
    $scope.currentTab = $routeParams.tab ? $routeParams.tab : 'All';
    $scope.tabs = [ 'All' ];

    $scope.navigateTo = function(path) {
        $location.path('control/' + path);
    }

    itemService.getAll(function(items) {
        $scope.items['All'] = items;
        for (var int = 0; int < items.length; int++) {
            var item = items[int];
            if (item.type === 'GroupItem') {
                if(item.tags.indexOf("room") > -1) {
                    $scope.tabs.push(item.name);
                }
                $scope.items[item.name] = item.members;
            }
        }
        $scope.$watch('items', function(value) {
            var val = value || null;
            if (val) {
                $timeout(function() {
                    new Masonry('.items', {});
                }, 0, false);
            }
        });
    });

}).controller('PreferencesPageController', function($scope) {
    var localStorage = window.localStorage;
    var language = localStorage.getItem('language');
    var theme = localStorage.getItem('theme');

    $scope.language = language ? language : 'english';
    $scope.theme = theme ? theme : 'openhab';

    $scope.save = function(language, theme) {
        localStorage.setItem('language', language);
        localStorage.setItem('theme', theme);
        $scope.showSuccessToast('Preferences saved successfully. Please reload the page.');
    }

    $scope.getSelected = function(property) {
        return $('select#' + property + ' option:selected').val();
    }
}).controller('NavController', function($scope, $location) {
    $scope.isActive = function(viewLocation) {
        var active = (viewLocation === $location.path().split('/')[1]);
        return active;
    }
    $scope.$on('$routeChangeSuccess', function() {
        $('body').removeClass('sml-open');
        $('.mask').remove();
    });
}).controller('ControlController', function($scope, $timeout, itemService) {
	$scope.getItemName = function(itemName) {
        return itemName.replace(/_/g, ' ');
    }
	$scope.getStateText = function(item) {
		if(item.state === 'Uninitialized') {
			return item.state;
		}
		var state = item.type === 'NumberItem' ? parseInt(item.state) : item.state;
		
		if(!item.stateDescription || !item.stateDescription.pattern) {
			return state;
		} else {
			return sprintf(item.stateDescription.pattern, state);
		}
    }    
}).controller('DefaultItemController', function($scope, itemService) {

    $scope.sendCommand = function(state) {
        itemService.sendCommand({
            itemName : $scope.item.name
        }, state);
    }

}).controller('SwitchItemController', function($scope, $timeout, itemService) {
    $scope.toggle = function(state) {
        itemService.sendCommand({
            itemName : $scope.item.name
        }, state);
    }
}).controller('DimmerItemController', function($scope, $timeout, itemService) {

	$scope.on = parseInt($scope.item.state) > 0 ? 'ON' : 'OFF';
    
	$scope.setOn = function(on) {
        itemService.sendCommand({
            itemName : $scope.item.name
        }, on);
        
        var brightness = parseInt($scope.item.state);
        if(on === 'ON' && brightness === 0) {
        	$scope.item.state = 100;
        }
        if(on === 'OFF' && brightness > 0) {
        	$scope.item.state = 0;
        }
    }
	$scope.setBrightness = function(brightness) {
        var brightnessValue = brightness === 0 ? '0' : brightness;
        itemService.sendCommand({
            itemName : $scope.item.name
        }, brightnessValue);
        
        if(brightness > 0 && $scope.on === 'OFF') {
        	$scope.on = 'ON';
        }
        if(brightness === 0 && $scope.on === 'ON') {
        	$scope.on = 'OFF';
        }
    }
}).controller('ColorItemController', function($scope, $timeout, $element, itemService) {

	$scope.setOn = function(on) {
        itemService.sendCommand({
            itemName : $scope.item.name
        }, on);
        
        if(on === 'ON' && $scope.brightness === 0) {
        	$scope.brightness = 100;
        }
        if(on === 'OFF' && $scope.brightness > 0) {
        	$scope.brightness = 0;
        }
    }
	
    $scope.setBrightness = function(brightness) {
        var brightnessValue = brightness === 0 ? '0' : brightness;
        itemService.sendCommand({
            itemName : $scope.item.name
        }, brightnessValue);
        
        if(brightness > 0 && $scope.on === 'OFF') {
        	$scope.on = 'ON';
        }
        if(brightness === 0 && $scope.on === 'ON') {
        	$scope.on = 'OFF';
        }
    }
    
    $scope.setHue = function(hue) {
        var hueValue = hue === 0 ? '0' : hue;
        var color = $scope.toTinyColor($scope.item.state).toHsv();
        color.h = hueValue;
        
        if(!color.s) {
            color.s = 1;
        }
        if(!color.v) {
            color.v = 1;
        }
        
        $scope.item.state = $scope.toColorState(color);
        
        itemService.sendCommand({
            itemName : $scope.item.name
        }, $scope.item.state);
        
        var hexColor =  $scope.getHexColor();
        $($element).find('.hue .md-thumb').css('background-color', hexColor);
        
        if($scope.on === 'OFF') {
        	$scope.on = 'ON';
        	$scope.brightness = 100;
        }
    }

    $scope.toTinyColor = function(state) {
        var colorParts = state.split(",");
        return tinycolor({
            h : colorParts[0],
            s : colorParts[1] / 100,
            v : colorParts[2] / 100
        });
    }

    $scope.getHexColor = function() {
        var hsv = $scope.toTinyColor($scope.item.state).toHsv();
        
        hsv.s = 1;
        hsv.v = 1;
        
        return tinycolor(hsv).toHexString();
    }

    $scope.toColorState = function(hsv) {
        return Math.ceil(hsv.h) + ',' + Math.ceil(hsv.s * 100) + ',' + Math.ceil(hsv.v * 100);
    }
    
    var hue = $scope.toTinyColor($scope.item.state).toHsv().h;
    var brightness = $scope.toTinyColor($scope.item.state).toHsv().v * 100;
    
    $scope.hue = hue ? hue : 0;
    $scope.brightness = brightness ? brightness : 0;
    $scope.on = brightness > 0 ? 'ON' : 'OFF'; 
    
    var hexColor =  $scope.getHexColor();
    $($element).find('.hue .md-thumb').css('background-color', hexColor);

});