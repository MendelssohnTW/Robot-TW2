define("robotTW2/controllers/AttackCompletionController", [
	"robotTW2/services",
	"robotTW2/time"
	], function(
			services,
			time
	){
	return function AttackCompletionController($scope) {
		$scope.CLOSE = services.$filter("i18n")("CLOSE", services.$rootScope.loc.ale);
		$scope.SCHEDULE = services.$filter("i18n")("SCHEDULE", services.$rootScope.loc.ale);
		
		var self = this;

		$scope.date_init = services.$filter("date")(new Date(time.convertedTime()), "yyyy-MM-dd")
		$scope.hour_init = services.$filter("date")(new Date(time.convertedTime()), "HH:mm:ss")
		$scope.ms_init = 0;
		$scope.enviarFull = false;

		$scope.sendAttack = function(){
			services.AttackService.sendCommandAttack($scope)
		}

		if (!$scope.$$phase) {
			$scope.$apply();
		}

		return $scope;
	}
})