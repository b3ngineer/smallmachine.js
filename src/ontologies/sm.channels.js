;(function(sm) {
	var ontology = new sm.Ontology('sm.channels');

	// concepts
	ontology.addTerm('thing');
	ontology.addTerm('user');
	ontology.addTerm('system');
	ontology.addTerm('action');
	ontology.addTerm('click');
	ontology.addTerm('doubleClick');
	ontology.addTerm('keyPress');
	ontology.addTerm('task');
	ontology.addTerm('initialize');
	ontology.addTerm('insert');
	ontology.addTerm('remove');
	ontology.addTerm('get');
	ontology.addTerm('set');
	ontology.addTerm('messenger');
	ontology.addTerm('success');
	ontology.addTerm('error');

	// relationships
	ontology.addTerm('performs');
	ontology.addTerm('reactsTo');

	ontology.user.isA(ontology.thing);
	ontology.user.relatesTo(ontology.performs, ontology.action);
	ontology.system.isA(ontology.thing);
	ontology.system.relatesTo(ontology.performs, ontology.task);
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

	sm.saveOntology(ontology);
}(smallmachine));
