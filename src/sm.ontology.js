;(function(ontology) {
	'use strict';

	// concepts
	ontology._add(new ontology.Term("thing"));
	ontology._add(new ontology.Term("user"));
	ontology._add(new ontology.Term("system"));
	ontology._add(new ontology.Term("action"));
	ontology._add(new ontology.Term("click"));
	ontology._add(new ontology.Term("doubleClick"));
	ontology._add(new ontology.Term("keyPress"));
	ontology._add(new ontology.Term("task"));
	ontology._add(new ontology.Term("get"));
	ontology._add(new ontology.Term("set"));
	ontology._add(new ontology.Term("messenger"));
	ontology._add(new ontology.Term("success"));
	ontology._add(new ontology.Term("error"));

	// relationships
	ontology._add(new ontology.Term("performs"));
	ontology._add(new ontology.Term("reactsTo"));
	ontology._add(new ontology.Term("waitsFor"));

	// rules
	ontology.user._isA(ontology.thing);
	ontology.system._isA(ontology.thing);
	ontology.action._isA(ontology.thing);
	ontology.task._isA(ontology.thing);
	ontology.messenger._isA(ontology.thing);
	ontology.click._isA(ontology.action);
	ontology.doubleClick._isA(ontology.action);
	ontology.keyPress._isA(ontology.action);
	ontology.get._isA(ontology.task);
	ontology.set._isA(ontology.task);
	ontology.success._isA(ontology.messenger);
	ontology.error._isA(ontology.messenger);

	// WEAKNESS
	// hasProperty and hasRange copy references, so they need to be established after subclassing)
	ontology.performs._hasRange(ontology.action);
	ontology.performs._hasRange(ontology.task);
	ontology.waitsFor._hasRange(ontology.task)._hasDomain(ontology.messenger);
	ontology.reactsTo._hasRange(ontology.action)._hasDomain(ontology.system);
	ontology.user._hasProperty(ontology.performs, ontology.action);
	ontology.system._hasProperty(ontology.performs, ontology.task);
	ontology.messenger._hasProperty(ontology.waitsFor, ontology.task);
}(sm));
