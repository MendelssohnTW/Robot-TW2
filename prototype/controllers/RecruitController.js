define("robotTW2/controllers/RecruitController", [
	"helper/time",
	"robotTW2/time",
	"robotTW2/services",
	"robotTW2/providers",
	"robotTW2/conf",
	"conf/unitTypes",
	"robotTW2/databases/data_recruit"
	], function(
			helper,
			time,
			services,
			providers,
			conf,
			unitTypes,
			data_recruit
	){
	return function RecruitController($scope) {
		$scope.CLOSE = services.$filter("i18n")("CLOSE", services.$rootScope.loc.ale);
		$scope.MENU = services.$filter("i18n")("MENU", services.$rootScope.loc.ale);
		$scope.START = services.$filter("i18n")("START", services.$rootScope.loc.ale);
		$scope.STOP = services.$filter("i18n")("STOP", services.$rootScope.loc.ale);
		$scope.version = services.$filter("i18n")("version", services.$rootScope.loc.ale);
		
		
		$scope.data_recruit = data_recruit
		$scope.text_version = $scope.version + " " + data_recruit.version;
		
		$scope.isRunning = services.RecruitService.isRunning();
		
		var self = this
		, return_units = function (){
			var units = {};
			Object.keys(unitTypes).map(function(key){
				if(data_recruit.troops_not.some(elem => elem == unitTypes[key])){
					delete units[unitTypes[key]]
				} else {
					units[unitTypes[key]] = 0
				}
			})
			return units
		}

		$scope.setGroup = function (gr){
			$scope.grupoSelected = gr;
		}
		
		$scope.getTimeRest = function(){
			return data_recruit.complete > time.convertedTime() && $scope.isRunning ? helper.readableMilliseconds(data_recruit.complete - time.convertedTime()) : 0; 
		}

		$scope.getText = function(key){
			return services.$filter("i18n")("text_" + key, services.$rootScope.loc.ale, "recruit");
		}

		$scope.getClass = function(key){
			return "icon-20x20-unit-" + key;
		}

		$scope.start_recruit = function(){
			services.RecruitService.start();
			$scope.isRunning = services.RecruitService.isRunning();
		}

		$scope.stop_recruit = function(){
			services.RecruitService.stop();
			$scope.isRunning = services.RecruitService.isRunning();
			$scope.data_recruit.complete = 0
		}

		$scope.pause_recruit = function(){
			services.RecruitService.pause();
			$scope.paused = !0;
		}
		
		$scope.resume_recruit = function(){
			services.RecruitService.resume();
			$scope.paused = !1;
		}
		
		$scope.menu = function () {
			services.$rootScope.$broadcast(providers.eventTypeProvider.OPEN_MAIN);
		}
		
		$scope.$watch("grupoSelected", function(){
			if(!$scope.grupoSelected){return}
			if(!$scope.grupoSelected.units){
				$scope.grupoSelected.units = return_units();
			}
		})
		
		$scope.$on(providers.eventTypeProvider.INTERVAL_CHANGE_RECRUIT, function($event, data) {
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		})
		
		$scope.$on(providers.eventTypeProvider.ISRUNNING_CHANGE, function($event, data) {
			$scope.isRunning = services.RecruitService.isRunning();
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		})
		
		$scope.isRunning = services.RecruitService.isRunning();
		$scope.isPaused = services.RecruitService.isPaused();
		$scope.grupoSelected = data_recruit.Groups[Object.keys(data_recruit.Groups)[0]]

		$scope.$watch("data_recruit", function(){
			if(!$scope.data_recruit){return}
			data_recruit = $scope.data_recruit;
			data_recruit.set();
		}, true)
		
		$scope.setCollapse();

		return $scope;
	}
})
