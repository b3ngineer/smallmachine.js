;var sm = (function(module) {
	'use strict';

	var user = module.channels.extend('user');
	user.extend('click');

	var system = module.channels.extend('system');
	system.extend('click');

	module.channels.user.click.join(module.channels.system.click);
	return module;
}(sm || {}));
