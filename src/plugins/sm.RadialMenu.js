;(function(sm, $, raphael, sammy) {
	function RadialMenu(app) {
		this.helpers({
			showRadialMenu : function(options, position) {
				console.log('menu');
			}
		});
	};
	RadialMenu.prototype._name = 'RadialMenu';
	sm.type.extendedBy(RadialMenu);
}(smallmachine, jQuery, Raphael, Sammy));
