;var sm = (function(module) {
	'use strict';

	var user = module.channels.add('user');
	user.add('click');

	var system = module.channels.add('system');
	system.add('click');

	module.channels.user.click.join(module.channels.system.click);
	return module;
}(sm || {}));
