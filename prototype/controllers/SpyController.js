define("robotTW2/controllers/SpyController", [
	"robotTW2/services",
	"robotTW2/providers",
	"helper/time",
	"robotTW2/time",
	"robotTW2/databases/data_spy",
	"robotTW2/databases/data_villages"
	], function(
			services,
			providers,
			helper,
			time,
			data_spy,
			data_villages
	){
	return function SpyController($scope) {
		$scope.CLOSE = services.$filter("i18n")("CLOSE", services.$rootScope.loc.ale);
		$scope.CLEAR = services.$filter("i18n")("CLEAR", services.$rootScope.loc.ale);
		var self = this;
		
//		data_escolhida: 1551304200000
//		duration: 900000
//		id_command: "3102607103727"
//		spys: 2
//		startVillage: 2833
//		targetVillage: 2949
//		timer_delay: 395462
//		type: "units"
		
		$scope.data_spy = data_spy
		$scope.text_version = $scope.version + " " + data_spy.version;
		
		var TABS = {
				SPY 	: services.$filter("i18n")("spy", services.$rootScope.loc.ale, "spy"),
				LOG		: services.$filter("i18n")("log", services.$rootScope.loc.ale, "spy")
		}
		, TAB_ORDER = [
			TABS.SPY,
			TABS.LOG,
			]

		$scope.requestedTab = TABS.SPY;
		$scope.TABS = TABS;
		$scope.TAB_ORDER = TAB_ORDER;
		
		function getVillage(vid){
			if(!vid){return}
			return services.modelDataService.getSelectedCharacter().getVillage(vid)
		}

		function getVillageData(vid){
			if(!vid){return}
			return local_data_villages[vid].data;
		}
		
		Object.keys(data_villages.villages).map(function(key){
			let data = getVillage(key).data;
			angular.extend(local_data_villages, {[key] : {"data": data}})
			return local_data_villages;
		})

		var setActiveTab = function setActiveTab(tab) {
			$scope.activeTab								= tab;
			$scope.requestedTab								= null;
		}
		, initTab = function initTab() {
			if (!$scope.activeTab) {
				setActiveTab($scope.requestedTab);
			}
		}
		, update = function(){
			$scope.comandos = Object.keys(data_spy.commands).map(function(elem, index, array){
				return data_spy.commands[elem]
			});
			$scope.comandos.sort(function(a,b){return (a.data_escolhida - time.convertedTime() - a.duration) - (b.data_escolhida - time.convertedTime() - b.duration)})
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		}
		
		$scope.isRunning = services.SpyService.isRunning();
		
		$scope.getVstart = function(param){
			var vid = param.start_village;
			if(!vid){return}
			return getVillageData(vid).name
		}

		$scope.getVcoordStart = function(param){

			var vid = param.start_village;
			if(!vid){return}
			var x = getVillageData(vid).x
			var y = getVillageData(vid).y
			return "(" + x + "/" + y + ")"
		}
		
		$scope.getHoraSend = function(param){
			return services.$filter("date")(new Date(param.data_escolhida - param.duration), "HH:mm:ss.sss");
		}

		$scope.getHoraAlvo = function(param){
			return services.$filter("date")(new Date(param.data_escolhida), "HH:mm:ss.sss");
		}

		$scope.getDataAlvo = function(param){
			return services.$filter("date")(new Date(param.data_escolhida), "dd/MM/yyyy");
		}

		$scope.getTimeRest = function(param){
			var difTime = param.data_escolhida - time.convertedTime() - param.duration; 
			return helper.readableMilliseconds(difTime)
		}

		$scope.getVcoordTarget = function(param){
			return "(" + param.target_x + "/" + param.target_y + ")"
		}
		
		$scope.clear_spy = function(){
			services.SpyService.removeAll();
		}

		$scope.removeCommand = services.SpyService.removeCommandSpy;

		$scope.$on(providers.eventTypeProvider.CHANGE_COMMANDS, function() {
			update();
		})
		
		$scope.blur = function(){
			var t = $("#input-ms").val();
			if(t.length <= 5) {
				t = t + ":00"
			}
			data_spy.interval = helper.unreadableSeconds(t) * 1000;
		}
		
		$scope.getTimeRest = function(){
			return data_spy.complete > time.convertedTime() ? helper.readableMilliseconds(data_spy.complete - time.convertedTime()) : 0;
		}

		
		$scope.$on(providers.eventTypeProvider.INTERVAL_CHANGE_SPY, function($event, data) {
			document.getElementById("input-ms").value = helper.readableMilliseconds(data_spy.interval).length == 7 ? "0" + helper.readableMilliseconds(data_spy.interval) : helper.readableMilliseconds(data_spy.interval);
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		})
		
		$scope.$on(providers.eventTypeProvider.ISRUNNING_CHANGE, function($event, data) {
			$scope.isRunning = services.SpyService.isRunning();
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		})
		
		$scope.$watch("data_logs.spy", function(){
			$scope.recalcScrollbar();
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		}, true)
		
		$scope.$watch("data_spy", function(){
			if(!$scope.data_spy){return}
			data_spy = $scope.data_spy;
			data_spy.set();
		}, true)
		
		$scope.$on("$destroy", function() {
			$scope.data_spy.set();
		});
		
		document.getElementById("input-ms").value = helper.readableMilliseconds(data_spy.interval).length == 7 ? "0" + helper.readableMilliseconds(data_spy.interval) : helper.readableMilliseconds(data_spy.interval);
		
		$scope.setCollapse();
		
		return $scope;
	}
})
