define("robotTW2/spy", [
	"robotTW2/ready",
	"robotTW2/eventQueue",
	"robotTW2/data_spy",
	"robotTW2/data_villages",
	"robotTW2/conf", 
	"robotTW2/services",
	"robotTW2/providers"
	], function(
			ready,
			eventQueue,
			data_spy,
			data_villages,
			conf, 
			services,
			providers
	){
	var isInitialized = !1
	, isRunning = !1
	, interval_spy = null
	, listener_spy = undefined
	, data = data_spy.getSpy()
	, counterMeasureTypes = {
		CAMOUFLAGE: "camouflage",
		DUMMIES: "dummies",
		EXCHANGE: "exchange",
		SWITCH_WEAPONS: "switch_weapons"
	}
	, getMaxSpies = function(researches, level){
		var a, b, c = {}, d;
		for (a in researches)
			for (b in counterMeasureTypes)
				counterMeasureTypes[b] === a && (c[a] = researches[a]);

		d = Object.keys(c).map(function(key, index, array){
			if (c[key].required_level <= level) {
				return c[key]
			} else {
				return
			}
		}).filter(f => f != undefined);

		return level > 0 ? Object.keys(d).length + 1 : 0;
	}
	, recruit_spy = function (){
		var lista_aldeias = data_villages.getVillages();
		Object.keys(lista_aldeias).forEach(function(id){
			var selectedVillage = services.modelDataService.getSelectedCharacter().getVillage(id);
			if(selectedVillage && selectedVillage.data.buildings) {
				var spies = selectedVillage.scoutingInfo.spies;
				var maxSpies = getMaxSpies(selectedVillage.data.buildings.tavern.researches, selectedVillage.data.buildings.tavern.level);
				var count = 0;
				for (i = 0; i < maxSpies; i++ ){
					var spy = spies[i];
					if (spy.type == 0 && !spy.active) {
						services.socketService.emit(providers.routeProvider.SCOUTING_RECRUIT, {
							'village_id'	: selectedVillage.getId(),
							'slot'			: spy.id
						});
					};
				}
			}
		})
	}
	, wait = function(){
		if(!interval_spy){
			interval_spy = services.$timeout(recruit_spy, data.INTERVAL)
		} else {
			services.$timeout.cancel(interval_spy);
			interval_spy = services.$timeout(recruit_spy, data.INTERVAL)
		}
	}
	, init = function (){
		isInitialized = !0
		start();
	}
	, start = function (){
		!listener_spy ? listener_spy = $rootScope.$on(providers.eventTypeProvider.SCOUTING_SPY_PRODUCED, recruit_spy) : listener_spy;
		isRunning = !0;
		wait();
		recruit_spy();
	}
	, stop = function (){
		typeof(listener_spy) == "function" ? listener_spy(): null;
		listener_spy = undefined;
		isRunning = !1,
		services.$timeout.cancel(interval_spy);
		interval_spy = undefined;
	}
	return	{
		init			: init,
		start			: start,
		stop 			: stop,
		isRunning		: function() {
			return isRunning
		},
		isInitialized	: function(){
			return isInitialized
		},
		version			: "1.0.0",
		name			: "spy"
	}

})
,
define("robotTW2/spy/ui", [
	"robotTW2/spy",
	"robotTW2/builderWindow",
	"robotTW2/services",
	"robotTW2/providers",
	"robotTW2/data_alert",
	"helper/time",
	"robotTW2/conf"
	], function(
			spy,
			builderWindow,
			services,
			providers,
			data_alert,
			helper,
			conf
	){
	var $window
	, build = function(callback) {
		var hotkey = conf.HOTKEY.SPY;
		var templateName = "spy";
		$window = new builderWindow(hotkey, templateName, callback)
		return $window
	}
	, injectScope = function(){

	}

	Object.setPrototypeOf(spy, {
		build : function(){
			build(injectScope)
		}
	})

})