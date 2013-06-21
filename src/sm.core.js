;var sm = (function(ontology) {
	'use strict';

	ontology.Guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};

	var Message = function() {
		return this;
	};

	var Channel = function() {
		this.id = new ontology.Guid();
		return this;
	};

	Channel.prototype.subscribe = function(subscriber) {
		return this;
	};

	Channel.prototype.publish = function(Message) {
		return this;
	};

	var Rules = function() {
		return this;
	};

	Rules.prototype = Channel.prototype;

	var Term = function(value) {
		this._value = value;
		return this;
	};

	Term.prototype = Rules.prototype;

	ontology._add = function(Term) {
		ontology[Term._value] = Term;
		return ontology;
	};

	// isA (relationship) codifies subsumption
	Rules.prototype._isA = function(Term) {
		ontology[Term._value][this._value] = this;		
		return this;
	};

	// concepts
	ontology._add(new Term("thing"));
	ontology._add(new Term("user"));
	ontology._add(new Term("system"));
	ontology._add(new Term("action"));
	ontology._add(new Term("click"));
	ontology._add(new Term("doubleClick"));
	ontology._add(new Term("keyPress"));
	ontology._add(new Term("task"));
	ontology._add(new Term("get"));
	ontology._add(new Term("set"));
	ontology._add(new Term("messenger"));
	ontology._add(new Term("success"));
	ontology._add(new Term("error"));
	ontology._add(new Term("messenger"));

	// relationships
	ontology._add(new Term("performs"));
	ontology._add(new Term("reactsTo"));
	ontology._add(new Term("waitsFor"));

	// properties
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

	return ontology;
}(sm || {}));
