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

	Channel.prototype._subscribe = function(subscriber) {
		return this;
	};

	Channel.prototype._publish = function(Message) {
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
		return Term;
	};

	Rules.prototype._hasProperty = function(TermA, TermB) {
		ontology[this._value][TermA._value] = {};
		ontology[this._value][TermA._value][TermB._value] = TermB;

		for (var field in TermB) {
			if (!TermB.hasOwnProperty(field)) {
				continue;
			}
			if (typeof TermB[field] == 'function' || field.indexOf('_') == 0) {
				continue;
			}
			if (typeof TermB[field]._value == 'undefined') {
				continue;
			}
			ontology[this._value][TermA._value][field] = TermB[field];
		};

		return this;
	};

	// subsumption
	Rules.prototype._isA = function(Term) {
		ontology[Term._value][this._value] = this;
		return this;
	};

	// object property range
	Rules.prototype._hasRange = function(Term) {
		ontology[this._value][Term._value] = Term;

		for (var field in Term) {
			if (!Term.hasOwnProperty(field)) {
				continue;
			}
			if (typeof Term[field] == 'function' || field.indexOf('_') == 0) {
				continue;
			}
			if (typeof Term[field]._value == 'undefined') {
				continue;
			}
			ontology[this._value][Term[field]._value] = Term[field];
		};

		return this;
	};

	// object property domain
	Rules.prototype._hasDomain = function(Term) {
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

	// hasProperty and hasRange copy references, so they need to be established after subclassing)
	ontology.performs._hasRange(ontology.action);
	ontology.performs._hasRange(ontology.task);
	ontology.waitsFor._hasRange(ontology.task)._hasDomain(ontology.messenger);
	ontology.reactsTo._hasRange(ontology.action)._hasDomain(ontology.system);
	ontology.user._hasProperty(ontology.performs, ontology.action);
	ontology.system._hasProperty(ontology.performs, ontology.task);
	ontology.messenger._hasProperty(ontology.waitsFor, ontology.task);

	return ontology;
}(sm || {}));

