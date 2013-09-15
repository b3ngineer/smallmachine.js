;var channels = (function(sm) {
	'use strict';

    var channels = sm();

	// concepts
	channels.add('thing');
	channels.add('user');
	channels.add('system');
	channels.add('action');
	channels.add('click');
	channels.add('doubleClick');
	channels.add('keyPress');
	channels.add('task');
	channels.add('initialize');
	channels.add('insert');
	channels.add('remove');
	channels.add('get');
	channels.add('set');
	channels.add('messenger');
	channels.add('success');
	channels.add('error');

	// relationships
	channels.add('performs');
	channels.add('reactsTo');

    console.log(channels);

	// rules (order dependent) TODO: get rid of order dependence
	channels.user.isA(channels.thing);
	channels.system.isA(channels.thing);
	channels.action.isA(channels.thing);
	channels.task.isA(channels.thing);
	channels.messenger.isA(channels.thing);
	channels.click.isA(channels.action);
	channels.doubleClick.isA(channels.action);
	channels.keyPress.isA(channels.action);
	channels.get.isA(channels.task);
	channels.set.isA(channels.task);
	channels.success.isA(channels.messenger);
	channels.error.isA(channels.messenger);
	channels.initialize.isA(channels.task);
	channels.insert.isA(channels.task);
	channels.remove.isA(channels.task);
	channels.performs.hasRange(channels.action).hasRange(channels.task);
	channels.reactsTo.hasRange(channels.action).hasDomain(channels.system);
	channels.user.relatesTo(channels.performs, channels.action);
	channels.system.relatesTo(channels.performs, channels.task);

    return channels;
}(smallmachine));
