define("robotTW2/databases/data_headquarter", [
	"robotTW2/databases/database",
	"robotTW2/conf",
	"robotTW2/services",
	"robotTW2/notify"
	], function(
			database,
			conf,
			services,
			notify
	) {
	var db_headquarter = {};
	
	db_headquarter.setHeadquarter = function(data_headquarter){
		if(data_headquarter){
			database.set("data_headquarter", data_headquarter, true)
		}
	}

	db_headquarter.getHeadquarter = function(){
		return database.get("data_headquarter")
	}

	db_headquarter.getTimeCicle = function(){
		return database.get("data_headquarter").interval
	}

	db_headquarter.setTimeCicle = function(timecicle){
		if(timecicle){
			var data = database.get("data_headquarter")
			data.interval = timecicle
			database.set("data_headquarter", data, true)
		}
	}

	db_headquarter.setTimeComplete = function(time){
		if(time){
			var data = database.get("data_headquarter")
			data.completed_at = time
			database.set("data_headquarter", data, true)
		}
	}

	var data_headquarter = database.get("data_headquarter");
	var dataNew = {
			auto_initialize			: false,
			initialized 				: false,
			activated 				: false,
			interval				: conf.INTERVAL.HEADQUARTER,
			version					: conf.VERSION.HEADQUARTER,
			reserva 				: {
				food			: conf.RESERVA.HEADQUARTER.FOOD,
				wood			: conf.RESERVA.HEADQUARTER.WOOD,
				clay			: conf.RESERVA.HEADQUARTER.CLAY,
				iron			: conf.RESERVA.HEADQUARTER.IRON,
				slots			: conf.RESERVA.HEADQUARTER.SLOTS
			},
			buildingorder 			: conf.BUILDINGORDER,
			buildinglimit 			: conf.BUILDINGLIMIT,
			buildinglevels 			: conf.BUILDINGLEVELS
	}

	if(!data_headquarter){
		data_headquarter = dataNew
		database.set("data_headquarter", data_headquarter, true)
	} else {
		if(!data_headquarter.version || data_headquarter.version < conf.VERSION.HEADQUARTER){

			data_headquarter = dataNew
			database.set("data_headquarter", data_headquarter, true)
			notify("data_headquarter");
		} else {
			if(!data_headquarter.auto_initialize) data_headquarter.initialized = !1;
			if(data_headquarter.auto_initialize) data_headquarter.initialized = !0;
			database.set("data_headquarter", data_headquarter, true)		
		}
	}

	Object.setPrototypeOf(data_headquarter, db_headquarter);

	return data_headquarter;
})