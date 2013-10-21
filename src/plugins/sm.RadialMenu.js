;(function(sm, $, raphael, sammy) {
	var RadialMenu = function(app) {
		this.helpers({
			showRadialMenu : function(options, position) {
				console.log('menu');
			}
		});
	};
	sm.type.extendedBy(RadialMenu, 'RadialMenu');
}(smallmachine, jQuery, Raphael, Sammy));
