define("robotTW2/controllers/HeadquarterController", [
	"helper/time",
	"robotTW2/time",
	"robotTW2/services",
	"robotTW2/providers",
	"robotTW2/conf",
	], function(
			helper,
			convertedTime,
			services,
			providers,
			conf
	){
	return function HeadquarterController($rootScope, $scope) {
		$scope.restore = services.$filter("i18n")("RESTORE", $rootScope.loc.ale);
		$scope.close = services.$filter("i18n")("CLOSE", $rootScope.loc.ale);
		$scope.start = services.$filter("i18n")("START", $rootScope.loc.ale);
		$scope.pause = services.$filter("i18n")("PAUSE", $rootScope.loc.ale);
		$scope.resume = services.$filter("i18n")("RESUME", $rootScope.loc.ale);
		$scope.stop = services.$filter("i18n")("STOP", $rootScope.loc.ale);

		var self = this
		, selectedFilter = $rootScope.data_headquarter.selects[0];

		function ret(){
			return $rootScope.data_headquarter.selects.map(function(elem){
				return {'name': services.$filter('i18n')(elem, $rootScope.loc.ale, "headquarter"), 'value': elem}
			});
		}

		$scope.shared = {};
		Object.keys($rootScope.data_villages.villages).map(function(elem){
			$scope.shared[elem] = {
					'viewList': ret(),
					'selectedAction': {
						"name": services.$filter('i18n')($rootScope.data_villages.villages[elem].selected, $rootScope.loc.ale, "headquarter"),
						"valeu": $rootScope.data_villages.villages[elem].selected
					}
			};	
		})
		
		$scope.getList = function(vill){
			if(!shared[vill.data.villageId]) return
			return shared[vill.data.villageId].viewList
		}
		
		$scope.getSelectedAction = function(vill){
			if(!shared[vill.data.villageId]) return
			return shared[vill.data.villageId].selectedAction
		}


		$scope.isRunning = services.HeadquarterService.isRunning();

		$scope.toggleSelect = function($event){

		}

		$scope.getTimeRest = function(){
			return $rootScope.data_headquarter.complete > convertedTime() ? helper.readableMilliseconds($rootScope.data_headquarter.complete - convertedTime()) : 0;
		}

		$scope.getKey = function(buildingOrder){
			return services.$filter("i18n")(Object.keys(buildingOrder)[0], $rootScope.loc.ale, "headquarter");
		}

		$scope.getClass = function(buildingOrder){
			return "icon-20x20-building-" + Object.keys(buildingOrder)[0];
		}

		$scope.getValue = function(buildingOrder){
			return Object.values(buildingOrder)[0];
		}

		$scope.up = function(data, buildingOrder){
			var ant = data.buildingorder.find(function(a,b){return Object.values(a)[0]==Object.values(buildingOrder)[0]-1})
			ant[Object.keys(ant)[0]] += 1
			buildingOrder[Object.keys(buildingOrder)[0]] -= 1
			data.buildingorder = data.buildingorder.map(function(key,index,array){return delete data.buildingorder[index].$$hashKey ? data.buildingorder[index] : undefined}).sort(function(a,b){return Object.values(a)[0] - Object.values(b)[0]})
			if (!$scope.$$phase) {$scope.$apply();}
		}

		$scope.down = function(data, buildingOrder){
			var prox = data.buildingorder.find(function(a,b){return Object.values(a)[0]==Object.values(buildingOrder)[0]+1})
			prox[Object.keys(prox)[0]] -= 1
			buildingOrder[Object.keys(buildingOrder)[0]] += 1
			data.buildingorder = data.buildingorder.map(function(key,index,array){return delete data.buildingorder[index].$$hashKey ? data.buildingorder[index] : undefined}).sort(function(a,b){return Object.values(a)[0] - Object.values(b)[0]})
			if (!$scope.$$phase) {$scope.$apply();}
		}

		$scope.levelup = function(buildingLimit){
			var max_level = services.modelDataService.getGameData().getBuildingDataForBuilding(Object.keys(buildingLimit)[0]).max_level;
			var level = buildingLimit[Object.keys(buildingLimit)[0]] += 1;
			if(level > max_level){
				buildingLimit[Object.keys(buildingLimit)[0]] -= 1
			}

			if (!$scope.$$phase) {$scope.$apply();}
		}

		$scope.leveldown = function(buildingLimit){
			buildingLimit[Object.keys(buildingLimit)[0]] -= 1
			if (!$scope.$$phase) {$scope.$apply();}
		}

		$scope.start_headquarter = function(){
			services.HeadquarterService.start();
			$scope.isRunning = services.HeadquarterService.isRunning();
		}

		$scope.stop_headquarter = function(){
			services.HeadquarterService.stop();
			$scope.isRunning = services.HeadquarterService.isRunning();
		}

		$scope.pause_headquarter = function(){
			services.HeadquarterService.pause();
			$scope.paused = !0;
		}

		$scope.resume_headquarter = function(){
			services.HeadquarterService.resume();
			$scope.paused = !1;
		}

		$scope.restore_headquarter = function(){
			$rootScope.data_headquarter.interval = conf.INTERVAL.HEADQUARTER
			Object.values($rootScope.data_villages.villages).forEach(function(village){
				angular.merge(village, {
					executebuildingorder 		: conf.executebuildingorder,
					buildingorder 			: $rootScope.data_headquarter.buildingorder,
					buildinglimit 			: $rootScope.data_headquarter.buildinglimit,
					buildinglevels 			: $rootScope.data_headquarter.buildinglevels
				})
			})
			if (!$scope.$$phase) $scope.$apply();
		}

		$scope.selectvillagebuildingOrder = function(villageId, buildingOrder){
			$scope.selected_village_buildingOrder[villageId] = buildingOrder;
		}

		$scope.set_selected_buildingOrder = function(selected_buildingOrder){
			$scope.selected_buildingOrder = selected_buildingOrder
		}

		$scope.selected_buildingOrder = {};
		$scope.selected_village_buildingOrder = [];

		$scope.$on(providers.eventTypeProvider.INTERVAL_CHANGE_HEADQUARTER, function($event, data) {
			if (!$rootScope.$$phase) {
				$rootScope.$apply();
			}
		})

		$scope.$on(providers.eventTypeProvider.ISRUNNING_CHANGE, function($event, data) {
			$scope.isRunning = services.HeadquarterService.isRunning();
			if (!$rootScope.$$phase) {
				$rootScope.$apply();
			}
		})

//		$scope.$on(providers.eventTypeProvider.SELECT_SELECTED, setFilters);

		$scope.recalcScrollbar();
		$scope.setCollapse();

		return $scope;
	}
})
