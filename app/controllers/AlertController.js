define("robotTW2/controllers/AlertController", [
	"robotTW2",
	"robotTW2/databases",
	"robotTW2/services",
	"robotTW2/providers",
	"helper/time",
	], function(
			robotTW2,
			databases,
			services,
			providers,
			helper
	){
	return function AlertController($rootScope, $scope) {
		$scope.CLOSE = services.$filter("i18n")("CLOSE", $rootScope.loc.ale);
		var self = this;

		var getMembers = function(callback){
			return new Promise(function(resolve, reject){
				try {
					services.socketService.emit(providers.routeProvider.TRIBE_GET_MEMBERLIST, {'tribe': services.modelDataService.getSelectedCharacter().getTribeId()}, function (o) {
						services.$timeout(_ => {
							if (o){
								resolve(o) 
							} else {
								reject();
							}
						}, 2000);
					});
				} catch (Error){
					reject(Error);
				}	
			})
			.then(function(data){
				if(data.members){
					$scope.members = data.members;
				} else {
					!$scope.members ? $scope.members = {} : $scope.members;
				}
				upDate()
			}, function(reason) {
				$rootScope.$broadcast(providers.eventTypeProvider.MESSAGE_ERROR, {message: "Erro ao carregar dados dos membros da tribo"})
				!$scope.members ? $scope.members = {} : $scope.members;
				upDate()
				//console.log(reason); // Error!
			});

		}
//		, getTribeName = function(member_id){
//			return services.modelDataService.getSelectedCharacter(member_id).getTribe().data.name
//		}
		, upDate = function(){
			$scope.members = $scope.members.map(function(member){
				if($rootScope.data_alert.friends.find(f => f === member.name)){
					member.isFriend = true;
				} else {
					member.isFriend = false;
				}
				return member
			})
			$scope.underattack = $scope.members.map(function(member){
				return member.under_attack && $rootScope.data_alert.friends.some(s => s === member.name) ? member : undefined;
			}).filter(f=>f!=undefined)
			if (!$rootScope.$$phase) $rootScope.$apply();
		}

		$scope.underattack = [];

		getMembers();

//		$scope.getTribeName = getTribeName;

		$scope.set = function(interval_alert){
			if(interval_alert.length <= 5){
				interval_alert = interval_alert + ":00"
			}
			if (helper.unreadableSeconds(interval_alert) * 1e3 > 30*60*1000){
				$rootScope.data_alert.interval = 30*60*1000
				$scope.interval_alert = 30*60*1000;
			} else if (helper.unreadableSeconds(interval_alert) * 1e3 < 5*60*1000){
				$rootScope.data_alert.interval = 5*60*1000
				$scope.interval_alert = 5*60*1000;
			} else {
				$rootScope.data_alert.interval = helper.unreadableSeconds(interval_alert) * 1e3
				$scope.interval_alert = interval_alert;
			}
			document.getElementById("input-text-time-interval").value = $scope.interval_alert; 
			if (!$rootScope.$$phase) $rootScope.$apply();

		}

		$scope.selectAll = function(){
			var list = [];
			$scope.members.forEach(function(member){
				member.isFriend = true;
				if(!$rootScope.data_alert.friends.find(f=>f==member.name)){
					list.push(member.name)
				}
			})
			
			$rootScope.data_alert.friends = $rootScope.data_alert.friends.concat(list);
			upDate()
		}

		$scope.removeAll = function(){
			$scope.members.forEach(function(member){
				member.isFriend = false;
			})
			$rootScope.data_alert.friends = [];
			upDate()
		}

		$scope.remove = function(name){
			$rootScope.data_alert.friends = $rootScope.data_alert.friends.filter(f => f != name);
			upDate()
		}

		$scope.toggleValue = function(member){
			if(member.isFriend){
				$rootScope.data_alert.friends.push(member.name)
			} else {
				$rootScope.data_alert.friends = $rootScope.data_alert.friends.filter(f => f !== member.name);
			}
			upDate()
		}

		$scope.interval_alert = helper.readableMilliseconds($rootScope.data_alert.interval)

		return $scope;
	}
})