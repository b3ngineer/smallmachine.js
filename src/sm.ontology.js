;(function(ontology) {
	'use strict';

	// concepts
	ontology.add(new ontology.Term('thing'));
	ontology.add(new ontology.Term('user'));
	ontology.add(new ontology.Term('system'));
	ontology.add(new ontology.Term('action'));
	ontology.add(new ontology.Term('click'));
	ontology.add(new ontology.Term('doubleClick'));
	ontology.add(new ontology.Term('keyPress'));
	ontology.add(new ontology.Term('task'));
	ontology.add(new ontology.Term('initialize'));
	ontology.add(new ontology.Term('insert'));
	ontology.add(new ontology.Term('remove'));
	ontology.add(new ontology.Term('get'));
	ontology.add(new ontology.Term('set'));
	ontology.add(new ontology.Term('messenger'));
	ontology.add(new ontology.Term('success'));
	ontology.add(new ontology.Term('error'));

	// relationships
	ontology.add(new ontology.Term('performs'));
	ontology.add(new ontology.Term('reactsTo'));

	// rules (order dependent) TODO: get rid of order dependence
	ontology.user.isA(ontology.thing);
	ontology.system.isA(ontology.thing);
	ontology.action.isA(ontology.thing);
	ontology.task.isA(ontology.thing);
	ontology.messenger.isA(ontology.thing);
	ontology.click.isA(ontology.action);
	ontology.doubleClick.isA(ontology.action);
	ontology.keyPress.isA(ontology.action);
	ontology.get.isA(ontology.task);
	ontology.set.isA(ontology.task);
	ontology.success.isA(ontology.messenger);
	ontology.error.isA(ontology.messenger);
    ontology.initialize.isA(ontology.task);
    ontology.insert.isA(ontology.task);
    ontology.remove.isA(ontology.task);
	ontology.performs.hasRange(ontology.action).hasRange(ontology.task);
	ontology.reactsTo.hasRange(ontology.action).hasDomain(ontology.system);
	ontology.user.relatesTo(ontology.performs, ontology.action);
	ontology.system.relatesTo(ontology.performs, ontology.task);
}(smallmachine));
