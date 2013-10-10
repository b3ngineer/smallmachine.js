;(function(sm) {
	var o = new sm.Ontology('sm.properties');
	o.addTerm('property');
	o.addTerm('type');
	o.addTerm('ontology');
	o.addTerm('behavior');
	o.addTerm('hasMemberType');
	o.addTerm('hasMember');
	o.addTerm('Ontology');
	o.addTerm('Behavior');
	o.addTerm('Constructor');
	o.addTerm('Null');
	o.ontology.isA(o.property);
	o.behavior.isA(o.property);
	o.Ontology.isA(o.type);
	o.Behavior.isA(o.type);
	o.Constructor.isA(o.type);
	o.Null.isA(o.type);
	o.ontology.relatesTo(o.hasMemberType, o.Ontology); 
	o.behavior.relatesTo(o.hasMemberType, o.Behavior); 
	o.ontology.relatesTo(o.hasMember, o.Null);
	o.behavior.relatesTo(o.hasMember, o.Null);

	var TypeExtender = function() {
		return this;
	};

	TypeExtender.prototype.extendedBy = function(model,typeName) {
		if (typeof typeName !== 'undefined' && typeof model === 'function') {
			if (typeof this[typeName] !== 'undefined') {
				sm.alsoBehavesLike(this[typeName], model);
			}
			else {
				this[typeName] = model;
			}
			if (typeof this[typeName].prototype.getType !== 'function') {
				this[typeName].prototype.getType = function() {
					return '[object ' + typeName + ']';
				};
			}
			if (typeof this[typeName].prototype.ofType !== 'function') {
				this[typeName].prototype.ofType = function(type) {
					if (typeof type.getType === 'function') {
						return this.getType() === type.getType();
					}
					return this.getType() === '[object ' + type + ']';
				};
			}
			return;
		}
		var propertyName = typeName || model.title;
		if (typeof propertyName === 'undefined') {
			sm.error(new Error('Cannot call extendedBy on the core ontology with an object that is missing the \'title\' property without specifying a \'typeName\''));
		}
		if (typeof this[propertyName] !== 'undefined') {
			sm.alsoBehavesLike(this[propertyName], model);
			return;
		}
		var typeConcept = this.hasMemberType;
		if (typeof typeConcept === 'undefined' || typeof typeConcept.getType === 'undefined') {
			sm.error(new Error('The specified concept does not have a valid \'hasMemberType\' relationship with another concept'));
		}
		var hasMemberType = sm[this._value][typeConcept._value];
		if (typeof hasMemberType === 'undefined') {
			sm.error(new Error('The specified type does not exist in the core object model: ' + typeConcept._value));
		}
		if (typeof model.getType !== 'function') {
			sm.error(new Error('The specified model is missing the getType function: ' + propertyName));
		}
		var modelType = model.getType();
		var validModelType = false;
		for (var t in hasMemberType) {
			if (!hasMemberType.hasOwnProperty(t)) {
				continue;
			}
			if (typeof this[t].getType === 'undefined') {
				continue;
			}
			var comparison = '[object ' + t + ']';
			if (comparison === modelType) {
				this.hasMember[propertyName] = model;
				this[propertyName] = model; // syntax sugar; like all Terms provide
				validModelType = true;
				break;
			}
		}
		if (!validModelType) {
			sm.error(new Error('Did not find an allowed model type for: ' + modelType));
		}
	};

	var Null = function() {
		this.title = 'Null';
		return this;
	};

	Null.prototype.getType = function() {
		return '[object Null]';
	};

	Null.prototype.ofType = function(type) {
		if (type === null || type === 'null' || type === 'Null') return true;
		return false;
	};

	// a "core" ontology is used as a behavior model for smallmachine
	sm.alsoBehavesLike(sm, o.getModel(TypeExtender));
	sm.ontology.extendedBy(new Null());
	sm.behavior.extendedBy(new Null());

	var AsyncResult = function(channel) {
		this._channel = channel;
		return this;
	};

	AsyncResult.prototype.publish = function(message, recipients) {
		this._channel.publish(message, recipients);
		return this;
	};

	sm.type.extendedBy(AsyncResult, 'AsyncResult');

	var NamedValue = function(namespace, key, value) {
		if (typeof key === 'undefined') {
			sm.error(new Error('Parameter \'key\' is required when instantiating the sm.NamedValue type'));
		}
		this.namespace = namespace;
		this.key = key;
		this.value = value;
		return this;
	};

	sm.type.extendedBy(NamedValue, 'NamedValue');

	var NamedValueCollection = function() {
		this.title = 'NamedValueCollection';
		this._collection = {};
		return this;
	};

	NamedValueCollection.prototype.exists = function(namespaceOrNamedValue, key) {
		var namespace = namespaceOrNamedValue;
		if (typeof namespaceOrNamedValue.ofType === 'function' && namespaceOrNamedValue.ofType('NamedValue')) {
			namespace = namespaceOrNamedValue.namespace;		
			key = namespaceOrNamedValue.key;		
		}
		return typeof this._collection[namespace] !== 'undefined' && typeof this._collection[namespace][key] !== 'undefined';
	};

	NamedValueCollection.prototype.add = function(namespaceOrNamedValue, key, value) {
		var namespace = namespaceOrNamedValue.namespace || namespaceOrNamedValue;
		var k = namespaceOrNamedValue.key || key;
		if (typeof this._collection[namespace] !== 'undefined' && this._collection[namespace][k] !== 'undefined') {
			sm.error(new Error('Cannot add a new entry to the collection (already exists): [' + namespace + ']' + k));
		}
		this.modify(namespaceOrNamedValue, key, value);
		return this;
	};

	NamedValueCollection.prototype.modify = function(namespaceOrNamedValue, key, value) {
		var namespace = namespaceOrNamedValue.namespace || namespaceOrNamedValue;
		var k = namespaceOrNamedValue.key || key;
		var v = namespaceOrNamedValue.value || value;
		if (typeof k === 'undefined') {
			sm.error(new Error('Must supply a valid key'));
		}
		if (typeof v === 'undefined') {
			sm.error(new Error('Must supply a valid value'));
		}
		if (typeof this._collection[namespace] === 'undefined') {
			this._collection[namespace] = {};
		}
		this._collection[namespace][k] = v;
		return this;
	};

	NamedValueCollection.prototype.remove = function(namespace, key) {
		if (typeof this._collection[namespace] === 'undefined' || typeof this._collection[namespace][key] === 'undefined') {
			return;
		}
		delete this._collection[namespace][key];
		return this;
	};

	NamedValueCollection.prototype.getValue = function(namespaceOrNamedValue, key) {
		var namespace = namespaceOrNamedValue.namespace || namespaceOrNamedValue; 
		var k = namespaceOrNamedValue.key || key;
		if (typeof this._collection[namespace] === 'undefined' || this._collection[namespace][k] === 'undefined') {
			return;
		}
		var value = this._collection[namespace][k];
		if (typeof namespaceOrNamedValue.ofType === 'function' && namespaceOrNamedValue.ofType('NamedValue')) {
			if (typeof value !== 'undefined') {
				namespaceOrNamedValue.value = value;
			}
		}
		return value;
	};

	NamedValueCollection.prototype.ofType = function(type) {
		return type === 'NamedValueCollection' || (typeof type.getType === 'function' && type.getType() === this.getType());
	};

	sm.type.extendedBy(NamedValueCollection, 'NamedValueCollection');
}(smallmachine));

