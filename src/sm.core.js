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

	function getMissingDependency(ontologies, activator) {
		for (var i = 0; i < activator.dependencies.length; i++) {
			var foundDependency = false;
			for (var j = 0; j < ontologies.length; j++) {
				if (activator.dependencies[i] == ontologies[j].namespace) {
					foundDependency = true;
					break;
				}
			}
			if (!foundDependency) {
				return activator.dependencies[i];
			}
		}
		return null;
	};

    function ctor(ontologies, behaviors) {
		if (typeof ontologies === 'undefined') {
			core.error(new Error('Missing required parameter for smallmachine constructor: one or more instances of type \'Ontology\''));
		}
		var allOntologies = [].concat(ontologies);
		var namespaceList = '';
		for (var i = 0; i < allOntologies.length; i++) {
			if (typeof allOntologies[i] === 'undefined') {
				core.error(new Error('Element ' + i + ' of the ontologies argument passed to the smallmachine constructor is undefined'));
			}
			if (typeof allOntologies[i].namespace === 'undefined') {
				if (typeof core.ontology[allOntologies[i]] !== 'undefined') {
					namespaceList = namespaceList + allOntologies[i] + ',';
					allOntologies[i] = core.ontology[allOntologies[i]];
				}
			}
			else {
				namespaceList = namespaceList + allOntologies[i].namespace + ',';
			}
		}
		var ontology = new Ontology(namespaceList.substring(0,namespaceList.length - 1));
		for (var i = 0; i < allOntologies.length; i++) {
			// call ontology.addTerm for all terms in the additional ontology
			for (var p in allOntologies[i]) {
				if (!allOntologies[i].hasOwnProperty(p)) {
					continue;
				}
				if (typeof allOntologies[i][p]._name !== 'undefined'
					&& allOntologies[i][p]._name == 'Proxy') {
					var term = allOntologies[i][p]._term;
					ontology.addTerm(term._value);
				}
			}
			// add all of the rules in the additional ontology inferencer to the first ontology
			for (var j = 0; j < allOntologies[i]._inferencer._rules.length; j++) {
				ontology._inferencer._rules.push(allOntologies[i]._inferencer._rules[j]);
			}
			// merge activators
			for (var j = 0; j < allOntologies[i]._activators.length; j++) {
				var missingDependency = getMissingDependency(allOntologies, allOntologies[i]._activators[j]);
				if (missingDependency !== null) {
					core.error(new Error("Cannot wire-in ontology with missing activator dependency on '" + missingDependency + "'"));
				}
				ontology.registerActivator(allOntologies[i]._activators[j]);
				ontology._activators.sort(function(a, b) {
					if (a.namespace == b.namespace) {
						return 0;
					}
					for (var i = 0; i < a.dependencies.length; i++) {
						if (b.namespace == a.dependencies[i]) {
							return 1;
						}
					}
					for (var i = 0; i < b.dependencies.length; i++) {
						// if a is a dependency of b, it has a lower index
						if (a.namespace == b.dependencies[i]) {
							return -1;
						}
					}
					return 0;
				});
			}
		}
		return ontology.getModel(behaviors);
    };

	core = ctor;

	function alsoBehavesLike(a, b) {
		if (typeof a === 'undefined' || typeof b === 'undefined') {
			core.error(new Error('Cannot mixin with an undefined object'));
		}
		for (var p in b) {
			if (!b.hasOwnProperty(p)) {
				continue;
			}
			// don't copy "private" members or characteristics
			if (p.indexOf('_') == 0 || p === 'initializer') {
				continue;
			}
			if (typeof a[p] !== 'undefined') {
				if (typeof b[p].prototype !== 'undefined') {
					if (typeof b[p].prototype.initializer !== 'undefined' && b[p].prototype.initializer == true) {
						//b[p](a);
						continue;
					}
					var newBehaviorIsVirtual = typeof b[p].prototype.virtual !== 'undefined' ? b[p].prototype.virtual : false;
				}
				var currentBehaviorIsVirtual = (typeof a[p].prototype !== 'undefined') ? a[p].prototype.virtual : false;
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
			if (typeof a.prototype !== 'undefined') {
				core.alsoBehavesLike(a.prototype, b.prototype);
			}
		}
	}

	core.alsoBehavesLike = alsoBehavesLike;

	function error (Error, handler) {
		if (typeof handler !== 'undefined' && typeof handler.handleError === 'function') {
			handler.handleError(Error);
		}
		else if (typeof core.handleError === 'function') {
			core.handleError(Error);
		}
		else {
			throw Error;
		}
	};

	core.error = error;

	var _getGuid = function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	};

	function getGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, _getGuid);
	};

	core.getGuid = getGuid;
	core.CONCEPT = 'concept';
	core.RELATIONSHIP = 'relationship';

	function Proxy(Term, Inferencer) {
		this._term = Term;
		this._rules = Inferencer._rules;
		return this;
	};

	Proxy.prototype._name = 'Proxy';

	function _Term() {
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

	function Behavior() {
		return this;
	};

	Behavior.prototype._name = 'Behavior';

	core.Behavior = Behavior;

	function Term(value) {
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
	}

	function Ontology(namespace) {
		this.namespace = namespace;
		this._inferencer = new Inferencer();
		this._activators = [];
		this._term = Term;
        return this;
    };

	Ontology.prototype._name = 'Ontology';

    Ontology.prototype.addTerm = function(value) {
		if (typeof this[value] !== 'undefined') {
			return this;
		}
		this._term.prototype.relate = _Term.prototype.relate;
        var t = new this._term(value);
		this[value] = new Proxy(t, this._inferencer);
        return this;
    };

	Ontology.prototype.addTerms = function(list) {
		for (var i = 0; i < list.length; i++) {
			this.addTerm(list[i]);
		}
	};

	Ontology.prototype.registerActivator = function(activator, dependencies) {
		if (typeof dependencies === 'undefined') {
			dependencies = [];
		}
		if (core.typeMask(activator, { fn : 'function', namespace : true, dependencies : true }) === null) {
			this._activators.push(activator);
			return;
		}
		this._activators.push({ fn : activator, namespace : this.namespace, dependencies : dependencies });
	};

	Ontology.prototype.getModel = function(behaviors) {
		var Model = function() {
			return this;
		};
		var model = new Model();
		var allBehaviors = [];
		if (typeof behaviors !== 'undefined') {
			allBehaviors = allBehaviors.concat(behaviors);
			for (var i = 0; i < allBehaviors.length; i++) {
				if (typeof allBehaviors[i] === 'undefined') {
					core.error('One or more [behaviors] arguments were supplied to the smallmachine constructor that are \'undefined\'; error creating object model');
				}
				if (typeof allBehaviors[i].prototype !== 'undefined' && allBehaviors[i].prototype.initializer === true) {
					allBehaviors[i](model);
				}
			}
		}
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
				for (var i = 0; i < allBehaviors.length; i++) {
					core.alsoBehavesLike(Object.getPrototypeOf(model[p]), allBehaviors[i].prototype);
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
			this._activators[i].fn(model);
		}
		return model;
	};

	core.Ontology = Ontology;

	function Inferencer() {
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

	function _alsoBehavesLike(target, behavior) {
		var term = this[target];
		if (typeof behavior === 'function') {
			core.alsoBehavesLike(term, behavior.prototype);
		}
		else {
			core.alsoBehavesLike(term, behavior);
		}
		for (var p in term) {
			if (!term.hasOwnProperty(p) || p.indexOf('_') === 0) {
				continue;
			}
			if (typeof term[p]._type !== 'undefined' && term[p]._type === core.CONCEPT) {
				if (typeof behavior === 'function') {
					core.alsoBehavesLike(term[p], behavior.prototype);
				}
				else {
					core.alsoBehavesLike(term[p], behavior);
				}
			}
		}
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

	Inferencer.prototype.alsoBehavesLike = function(behavior) {
		this._rules.push(new Rule(20, _alsoBehavesLike, [this._term._value, behavior])); 
		return this;
	};

	core.alsoBehavesLike(Proxy, Inferencer);

	/* relatesTo scopes cross-cutting concerns by implicitly grouping concepts */
	function relatesTo(target, termA, termB) {
		var Term = this[target];
		var TermA = this[termA];
		var TermB = this[termB];
		if (TermA._type === core.CONCEPT) {
			core.error(new Error('Cannot define a relationship with a concept type: ' + TermA._value));
		}
		else if (TermA._type === null) {
			TermA._type = core.RELATIONSHIP;
		}
		if (TermB._type === core.RELATIONSHIP) {
			core.error(new Error('Cannot create a relationship with a relationship type: ' + TermB._value));
		}
		else if (TermB._type === null) {
			TermB._type = core.CONCEPT;
		}
		if (Term._type === core.RELATIONSHIP) {
			core.error(new Error('Cannot create a relationship from a relationship type: ' + Term._value));
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
			if (typeof TermB[field].relate === 'function') {
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
	function isA(target, termA) {
		var Term = this[target];
		var TermA = this[termA];

		if (TermA._type === core.RELATIONSHIP) {
			core.error(new Error('Cannot apply isA to a relationship type: ' + TermA._value));
		}
		else if (TermA._type === null) {
			TermA._type = core.CONCEPT;
		}
		if (Term._type === core.RELATIONSHIP) {
			core.error(new Error('Cannot apply isA to a relationship type: ' + Term._value));
		}
		else if (Term._type === null) {
			Term._type = core.CONCEPT;
		}
		if (typeof TermA[target] === 'undefined') {
			TermA[target] = Term;
		}
	};

	/* object property range universally relates concepts downstream from an edge */
	function hasRange(target, termA) {
		var Term = this[target];
		var TermA = this[termA];
		if (TermA._type === core.RELATIONSHIP) {
			core.error(new Error('Cannot apply hasRange to a relationship type: ' + TermA._value));
		}
		else if (TermA._type === null) {
			TermA._type = core.CONCEPT;
		}
		if (Term._type === core.CONCEPT) {
			core.error(new Error('Cannot assign hasRange from a concept type: ' + Term._value));
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
			if (typeof TermA[field].relate === 'function') {
				var term = TermA[field]._value || null;
				if (term === null) {
					continue;
				}
				if (typeof Term[term] === 'undefined') {
					Term[term] = TermA[field];
				}
				TermA[field].relate(Term);
			}
		}
	};

	/* object property domain universally relates concepts upstream from an edge */
	function hasDomain(target, termA) {
		var Term = this[target];
		var TermA = this[termA];
		if (TermA._type === core.RELATIONSIP) {
			core.error(new Error('Cannot apply hasRange to a relationship type: ' + TermA._value));
		}
		else if (TermA._type === null) {
			TermA._type = core.CONCEPT;
		}
		if (Term._type === core.CONCEPT) {
			core.error(new Error('Cannot assign hasRange from a concept type: ' + Term._value));
		}
		else if (Term._type === null) {
			Term._type = core.RELATIONSHIP;
		}
		if (typeof TermA[target] === 'undefined') {
			TermA[target] = Term;
		}
	};

	function typeMask(a, b) {
		var result = [];
		for (var p in b) {
			if (!b.hasOwnProperty(p)) {
				continue;
			}
			if (typeof a === 'undefined' || typeof a[p] === 'undefined') {
				result.push(p);
			}
			else if (typeof a[p] !== 'undefined' && typeof a[p] !== b[p]) {
				if (b[p] !== true) {
					result.push(p);
				}
			}
		}
		return result.length === 0 ? null : result;
	};

	core.typeMask = typeMask;

	return core;
}(smallmachine || {}));

