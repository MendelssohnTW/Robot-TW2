define("robotTW2/services/MainService", [
	"robotTW2",
	"robotTW2/databases",
	"robotTW2/conf",
	], function(
			robotTW2,
			databases,
			conf
	){
	return (function MainService() {
		var service = {};
		var data_main = databases.data_main
		return service.initExtensions = function(){

			var extensions = data_main.getExtensions();
			for (var extension in extensions) {
				var arFn = robotTW2.requestFn.get(extension.toLowerCase(), true);
				if(!arFn) {
					extensions[extension].activated = false;
					continue
				} else {
					var fn = arFn.fn;
					extensions[extension].hotkey = conf.HOTKEY[extension].toUpperCase();
					extensions[extension].activated = true;
					if(extensions[extension].auto_initialize){
						if(fn.isInitialized())
							return !1;	
						if(typeof(fn.init) == "function"){fn.init()}
						if(typeof(fn.analytics) == "function"){fn.analytics()}
					}
				}
			}
			data_main.setExtensions(extensions);
			return extensions
		}
		, service
	})()
})