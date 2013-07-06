;(function(ontology) {
	'use strict';

	// concepts
	ontology.add(new ontology.Term("thing"));
	ontology.add(new ontology.Term("user"));
	ontology.add(new ontology.Term("system"));
	ontology.add(new ontology.Term("action"));
	ontology.add(new ontology.Term("click"));
	ontology.add(new ontology.Term("doubleClick"));
	ontology.add(new ontology.Term("keyPress"));
	ontology.add(new ontology.Term("task"));
	ontology.add(new ontology.Term("get"));
	ontology.add(new ontology.Term("set"));
	ontology.add(new ontology.Term("messenger"));
	ontology.add(new ontology.Term("success"));
	ontology.add(new ontology.Term("error"));

	// relationships
	ontology.add(new ontology.Term("performs"));
	ontology.add(new ontology.Term("reactsTo"));
	ontology.add(new ontology.Term("waitsFor"));

	// rules
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

	// WEAKNESS
	// describedAs and hasRange copy references, so they need to be established after subclassing)
	ontology.performs.hasRange(ontology.action);
	ontology.performs.hasRange(ontology.task);
	ontology.waitsFor.hasRange(ontology.task).hasDomain(ontology.messenger);
	ontology.reactsTo.hasRange(ontology.action).hasDomain(ontology.system);
	ontology.user.describedAs(ontology.performs, ontology.action);
	ontology.system.describedAs(ontology.performs, ontology.task);
	ontology.messenger.describedAs(ontology.waitsFor, ontology.task);

    // alias prototype functions
    sm.addHelper = function(name, func) { sm.thing.addHelper(name, func); };

}(sm));
