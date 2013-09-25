;var smallmachine = (function(core) {
	'use strict';

	if ( typeof Object.getPrototypeOf !== 'function' ) {
		if (typeof 'test'.__proto__ === 'object' ) {
			Object.getPrototypeOf = function(object){
				return object.__proto__;
			};
		}
		else {
			Object.getPrototypeOf = function(object){
				return object.constructor.prototype;
			};
		}
	}

    core = function(ontology, behaviors) {
		if (typeof ontology === 'undefined') {
			throw new Error('Missing required parameter for smallmachine constructor: ontology [title or object]');
		}
		if (typeof core._ontology[ontology] !== 'undefined' && typeof core._ontology[ontology].getModel !== 'undefined') {
			return core._ontology[ontology].getModel(behaviors);
		}
		else if (typeof ontology.getModel !== 'undefined') {
			return ontology.getModel(behaviors);
		}
		throw new Error('Expected parameter to be the title of an ontology that was added (using addOnotology) or else a valid Ontology object');
    };

	core.alsoBehavesLike = function(a, b) {
		for (var p in b) {
			if (!b.hasOwnProperty(p)) {
				continue;
			}
			// don't copy "private" members
			if (p.indexOf('_') == 0) {
				continue;
			}
			if (typeof a[p] !== 'undefined') {
				var currentBehaviorIsVirtual = (typeof a[p].prototype !== 'undefined') ? a[p].prototype.virtual : false;
				var newBehaviorIsVirtual = (typeof b[p].prototype !== 'undefined') ? b[p].prototype.virtual : false;

				if (currentBehaviorIsVirtual && newBehaviorIsVirtual) {
					throw new Error('Cannot mixin duplicate named virtual behaviors: ' + p);
				}
				else if (currentBehaviorIsVirtual) {
					a[p] = b[p];
                    continue;
				}
				else if (newBehaviorIsVirtual) {
					continue;
				}
				throw new Error('Cannot mixin same-named behaviors: ' + p);
			}
			a[p] = b[p];
		}
		if (typeof b.prototype !== 'undefined') {
			if (typeof a.prototype === 'undefined') {
				a.prototype = {};
			}
			core.alsoBehavesLike(a.prototype, b.prototype);
		}
	}

	core.CONCEPT = 'concept';
	core.RELATIONSHIP = 'relationship';
	core.types = {};
	core._activators = [];

	core.addMessageType = function(name, ctor) {
		if (typeof ctor !== 'function') {
			throw new Error('Cannot create a message type without a constructor (function)');
		}
		if (typeof core.types[name] !== 'undefined') {
			core.alsoBehavesLike(core.types[name], ctor);
		}
		else {
			core.types[name] = ctor;
			core.types[name].prototype.getType = function() {
				return '[object ' + name + ']';
			};
			core.types[name].prototype.ofType = function(type) {
				return this.getType() == '[object ' + type + ']';
			};
		}
	};

	core.saveOntology = function(ontology) {
		if (typeof core._ontology === 'undefined') {
			core._ontology = {};
		}
		core._ontology[ontology.title] = ontology;
	};

	core.registerHelpers = function(activator) {
		core._activators.push(activator);
	};

	var Proxy = function(Term, Inferencer) {
		this._term = Term;
		this._rules = Inferencer._rules;
		return this;
	};

	Proxy.prototype.getType = function() {
		return '[object Proxy]';
	};

    core.Ontology = function(title) {
		this.title = title;
		this._inferencer = new Inferencer();
        return this;
    };

    core.Ontology.prototype.addTerm = function(value) {
		var Term = function(value) {
			if (typeof value._value !== 'undefined' && typeof value._type !== 'undefined') {
				this._value = value._value;
				this._type = value._type;
			}
			else {
				this._value = value;
				this._type = null;
			}
			return this;
		};

		Term.prototype.getType = function() {
			return '[object Term]';
		}

        var t = new Term(value);
		this[t._value] = new Proxy(t, this._inferencer);
        return this;
    };

	core.Ontology.prototype.getModel = function(behaviors) {
		var Model = function(title) {
			return this;
		};
		var model = new Model();
		for (var p in this) {
			if (!this.hasOwnProperty(p)) {
				continue;
			}
			if (typeof this[p] === 'undefined' || this[p]._term === 'undefined') {
				continue;
			}
			if (p.indexOf('_') === 0) {
				continue;
			}
			if (typeof this[p]._term !== 'undefined') {
				model[p] = this[p]._term;
				if (typeof behaviors !== 'undefined') {
					core.alsoBehavesLike(Object.getPrototypeOf(model[p]), behaviors.prototype);
				}
			}
			else {
				model[p] = this[p];
			}
		}
		this._inferencer._rules.sort(function(a,b) {
			return a._priority - b._priority;
		});
		for (var i = 0; i < this._inferencer._rules.length; i++) {
			var rule = this._inferencer._rules[i];
			rule._fn.apply(model, rule._args);
		}
		for (var i = 0; i < core._activators.length; i++) {
			core._activators[i](model);
		}
		return model;
	};

	var Inferencer = function() {
		this._term = { _value : null };
		this._rules = [];
		return this;
	};

	var Rule = function(priority, fn, args) {
		this._fn = fn;
		this._args = args;
		this._priority = priority;
		return this;
	};

	Inferencer.prototype.isA = function(Proxy) {
		this._rules.push(new Rule(1, isA, [this._term._value, Proxy._term._value]));
		return this;
	};

	Inferencer.prototype.relatesTo = function(ProxyA, ProxyB) {
		this._rules.push(new Rule(10, relatesTo, [this._term._value, ProxyA._term._value, ProxyB._term._value]));
		return this;
	};

	Inferencer.prototype.hasDomain = function(Proxy) {
		this._rules.push(new Rule(3, hasDomain, [this._term._value, Proxy._term._value]));
		return this;
	};

	Inferencer.prototype.hasRange = function(Proxy) {
		this._rules.push(new Rule(2, hasRange, [this._term._value, Proxy._term._value]));
		return this;
	};

	core.alsoBehavesLike(Proxy, Inferencer);

	/* relatesTo scopes cross-cutting concerns by implicitly grouping concepts */
	var relatesTo = function(target, termA, termB) {
		var Term = this[target];
		var TermA = this[termA];
		var TermB = this[termB];

		if (TermA._type === core.CONCEPT) {
			throw new Error('Cannot define a relationship with a concept type: ' + TermA._value);
		}
		else if (TermA._type === null) {
			TermA._type = core.RELATIONSHIP;
		}
		if (TermB._type === core.RELATIONSHIP) {
			throw new Error('Cannot create a relationship with a relationship type: ' + TermB._value);
		}
		else if (TermB._type === null) {
			TermB._type = core.CONCEPT;
		}
		if (Term._type === core.RELATIONSHIP) {
			throw new Error('Cannot create a relationship from a relationship type: ' + Term._value);
		}
		else if (Term._type === null) {
			Term._type = core.CONCEPT;
		}
		var ctor = Term.constructor;
		this[Term._value][TermA._value] = new ctor(TermA); // isolate relationship scope
		this[Term._value][TermA._value][TermB._value] = TermB; // put object property in scope
		this[Term._value][TermB._value] = TermB; // sugar for including property as child
		if (typeof TermB._relatesTo === 'undefined') {
			TermB._relatesTo = [];
		}
		TermB._relatesTo.push(this[Term._value][TermA._value]);
		for (var field in TermB) {
			if (!TermB.hasOwnProperty(field)) {
				continue;
			}
			if (typeof TermB[field] === 'function' || field.indexOf('_') === 0) {
				continue;
			}
			if (typeof TermB[field]._value === 'undefined') {
				continue;
			}
			this[Term._value][TermA._value][field] = TermB[field]; // link subclasses in scope
			this[Term._value][field] = TermB[field]; // sugar for linking subclasses as children
			if (typeof TermB[field]._relatesTo === 'undefined') {
				TermB[field]._relatesTo = [];
			}
			TermB[field]._relatesTo.push(this[Term._value][TermA._value]);
		}
	};

	/* subsumption establishes proximal relationship to other concepts */
	var isA = function(target, termA) {
		var Term = this[target];
		var TermA = this[termA];

		if (TermA._type === core.RELATIONSHIP) {
			throw new Error('Cannot apply isA to a relationship type: ' + TermA._value);
		}
		else if (TermA._type === null) {
			TermA._type = core.CONCEPT;
		}
		if (Term._type === core.RELATIONSHIP) {
			throw new Error('Cannot apply isA to a relationship type: ' + Term._value);
		}
		else if (Term._type === null) {
			Term._type = core.CONCEPT;
		}
		TermA[Term._value] = Term;
	};

	/* object property range universally relates concepts downstream from an edge */
	var hasRange = function(target, termA) {
		var Term = this[target];
		var TermA = this[termA];

		if (TermA._type === core.RELATIONSHIP) {
			throw new Error('Cannot apply hasRange to a relationship type: ' + TermA._value);
		}
		else if (TermA._type === null) {
			TermA._type = core.CONCEPT;
		}
		if (Term._type === core.CONCEPT) {
			throw new Error('Cannot assign hasRange from a concept type: ' + Term._value);
		}
		else if (Term._type === null) {
			Term._type = core.RELATIONSHIP;
		}
		this[Term._value][TermA._value] = TermA;
		
		if (typeof TermA._relatesTo === 'undefined') {
			TermA._relatesTo = [];
		}
		TermA._relatesTo.push(Term);
		for (var field in TermA) {
			if (!TermA.hasOwnProperty(field)) {
				continue;
			}
			if (typeof TermA[field] === 'function' || field.indexOf('_') === 0) {
				continue;
			}
			if (typeof TermA[field]._value === 'undefined') {
				continue;
			}
			this[Term._value][TermA[field]._value] = TermA[field];
			if (typeof TermA[field]._relatesTo === 'undefined') {
				TermA[field]._relatesTo = [];
			}
			TermA[field]._relatesTo.push(Term);
		};
	};

	/* object property domain universally relates concepts upstream from an edge */
	var hasDomain = function(target, termA) {
		var Term = this[target];
		var TermA = this[termA];

		if (TermA._type === core.RELATIONSIP) {
			throw new Error('Cannot apply hasRange to a relationship type: ' + TermA._value);
		}
		else if (TermA._type === null) {
			TermA._type = core.CONCEPT;
		}
		if (Term._type === core.CONCEPT) {
			throw new Error('Cannot assign hasRange from a concept type: ' + Term._value);
		}
		else if (Term._type === null) {
			Term._type = core.RELATIONSHIP;
		}
		this[TermA._value][Term._value] = Term;
	};

	var AsyncResult = function(channel) {
		this._channel = channel;
		return this;
	};

	AsyncResult.prototype.publish = function(message, recipients) {
		this._channel.publish(message, recipients);
		return this;
	};

	core.addMessageType('AsyncResult', AsyncResult);

	return core;
}(smallmachine || {}));

