;var tools = (function(sm, $, sammy) {
	return function() {
		this.use(sm.type.RadialMenu);

		this.get('#/', function() {
			this.showRadialMenu([
				{ label : 'Package', publishTo : '' },
				{ label : 'View', publishTo : '' },
				{ label : 'Tests', publishTo : '' }
			], 'center');
		});
	};
}(smallmachine, jQuery, Sammy));
