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
			throw new Error('Missing required parameter for smallmachine constructor: ontology (title or object)');
		}
		if (typeof ontology.getModel !== 'undefined') {
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
					continue;
				}
				else if (currentBehaviorIsVirtual) {
					a[p] = b[p];
                    continue;
				}
				else if (newBehaviorIsVirtual) {
					continue;
				}
			}
			else {
				a[p] = b[p];
			}
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

	var Proxy = function(Term, Inferencer) {
		this._term = Term;
		this._rules = Inferencer._rules;
		return this;
	};

	Proxy.prototype.getType = function() {
		return '[object Proxy]';
	};

	var _Term = function() {
		return this;
	};

	_Term.prototype.relate = function(Term) {
		if (typeof this._relatesTo === 'undefined') {
			this._relatesTo = [];
		}
		var alreadyRelatesTo = false;
		for (var i = 0; i < this._relatesTo.length; i++) {
			if (this._relatesTo[i]._id == Term._id) {
				alreadyRelatesTo = true;
				break;
			}
		}
		if (!alreadyRelatesTo) {
			this._relatesTo.push(Term);
		}
	};

	_Term.prototype.getType = function() {
		return '[object Term]';
	};

	core.Behavior = function(title) {
		this.title = title;
		return this;
	};

    core.Ontology = function(title) {
		this.title = title;
		this._inferencer = new Inferencer();
		this._activators = [];
		this._term = function(value) {
			this._id = (function() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			})})();
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
        return this;
    };

	core.Ontology.prototype.getType = function() {
		return '[object Ontology]';
	};

    core.Ontology.prototype.addTerm = function(value) {
		var Term = this._term;
		Term.prototype.relate = _Term.prototype.relate;
		Term.prototype.getType = _Term.prototype.getType;
        var t = new Term(value);
		this[t._value] = new Proxy(t, this._inferencer);
        return this;
    };

	core.Ontology.prototype.registerActivator = function(activator) {
		this._activators.push(activator);
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
		for (var i = 0; i < this._activators.length; i++) {
			this._activators[i](model);
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
		if (typeof Term[termA] === 'undefined') {
			var ctor = Term.constructor;
			Term[termA] = new ctor(TermA); // isolate relationship scope
		}
		if (typeof Term[termA][termB] === 'undefined') {
			Term[termA][termB] = TermB; // put object property in scope
		}
		if (typeof Term[termB] === 'undefined') {
			Term[termB] = TermB; // sugar for including property as child
		}
		TermB.relate(Term[termA]);
		for (var field in TermB) {
			if (!TermB.hasOwnProperty(field)) {
				continue;
			}
			if (TermB[field].getType && TermB[field].getType() === '[object Term]') {
				if (typeof Term[termA][field] === 'undefined') {
					Term[termA][field] = TermB[field]; // link subclasses in scope
				}
				if (typeof Term[field] === 'undefined') {
					Term[field] = TermB[field]; // sugar for linking subclasses as children
				}
				TermB[field].relate(Term[termA]);
			}
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
		if (typeof TermA[target] === 'undefined') {
			TermA[target] = Term;
		}
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
		if (typeof Term[termA] === 'undefined') {
			Term[termA] = TermA;
		}
		TermA.relate(Term);
		for (var field in TermA) {
			if (!TermA.hasOwnProperty(field)) {
				continue;
			}
			if (TermA[field].getType && TermA[field].getType() === '[object Term]') {
				var term = TermA[field]._value;
				if (typeof Term[term] === 'undefined') {
					Term[term] = TermA[field];
				}
				TermA[field].relate(Term);
			}
		}
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
		if (typeof TermA[target] === 'undefined') {
			TermA[target] = Term;
		}
	};

	return core;
}(smallmachine || {}));

