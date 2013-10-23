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

	function TypeExtender() {
		return this;
	};

	TypeExtender.prototype.extendedBy = function(model,typeName) {
		var typeConcept = this.hasMemberType;
		if (typeof typeName === 'undefined') {
			if (typeConcept === 'undefined') {
				typeName = model._name;
			}
			else if (typeof model.prototype !== 'undefined') {
				typeName = model.prototype._name;
			}
		}
		if (typeof typeName !== 'undefined' && typeof model === 'function') {
			if (typeof this[typeName] !== 'undefined') {
				sm.alsoBehavesLike(this[typeName], model);
			}
			else {
				this[typeName] = model;
			}
			if (typeof this[typeName]._name === 'undefined') {
				this[typeName]._name = typeName;
			}
			return;
		}
		var propertyName = typeName || model.namespace || model._name;
		if (typeof propertyName === 'undefined') {
			sm.error(new Error('Cannot call extendedBy on the core ontology with an object that is missing the \'namepsace\' and \'_name\' properties without specifying a \'typeName\''));
		}
		if (typeof this[propertyName] !== 'undefined') {
			sm.alsoBehavesLike(this[propertyName], model);
			return;
		}
		var hasMemberType = sm[this._value][typeConcept._value];
		if (typeof hasMemberType === 'undefined') {
			sm.error(new Error('The specified type does not exist in the core object model: ' + typeConcept._value));
		}
		var modelType = model._name || model.constructor.name;
		var validModelType = false;
		for (var t in hasMemberType) {
			if (!hasMemberType.hasOwnProperty(t)) {
				continue;
			}
			if (t.indexOf('_') === 0) {
				continue;
			}
			if (t === modelType) {
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

	function Null() {
		return this;
	};

	Null.prototype._name = 'Null';

	// a "core" ontology is used as a behavior model for smallmachine
	sm.alsoBehavesLike(sm, o.getModel(TypeExtender));
	sm.ontology.extendedBy(new Null());
	sm.behavior.extendedBy(new Null());

	function AsyncResult(channel) {
		this._channel = channel;
		return this;
	};
	
	AsyncResult.prototype._name = 'AsyncResult';

	AsyncResult.prototype.publish = function(message, recipients) {
		this._channel.publish(message, recipients);
		return this;
	};

	sm.type.extendedBy(AsyncResult);

	function NamedValue(namespace, key, value) {
		if (typeof key === 'undefined') {
			sm.error(new Error('Parameter \'key\' is required when instantiating the sm.NamedValue type'));
		}
		this.namespace = namespace;
		this.key = key;
		this.value = value;
		return this;
	};

	NamedValue.prototype.adapt = function(namespace, behaviors) {
		this.namespace = namespace;
		if (typeof behaviors !== 'undefined') {
			var allBehaviors = [].concat(behaviors);
			for (var i = 0; i < allBehaviors.length; i++) {
				sm.alsoBehavesLike(this, allBehaviors[i]);			
			}
		}
		return this;
	};

	NamedValue.prototype._name = 'NamedValue';

	sm.type.extendedBy(NamedValue);

	function NamedValueCollection() {
		this._collection = {};
		return this;
	};

	NamedValueCollection.prototype._name = 'NamedValueCollection';

	NamedValueCollection.prototype.exists = function(namespaceOrNamedValue, key) {
		var namespace = namespaceOrNamedValue;
		if (sm.typeMask(namespaceOrNamedValue, { namespace : true, key : true }) === null) {
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
		if (typeof value === 'undefined') {
			return value;
		}
		else if (typeof namespaceOrNamedValue.setValue === 'function') {
			namespaceOrNamedValue.setValue(value);
		}
		else if (typeof namespaceOrNamedValue.value !== 'undefined') {
			namespaceOrNamedValue.value = value;
		}
		return value;
	};

	sm.type.extendedBy(NamedValueCollection);
}(smallmachine));

