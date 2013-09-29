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
		if (typeof model.title === 'undefined') {
			throw new Error('Cannot extendedBy the core ontology with model that is missing the \'title\' property');
		}
		if (typeof this[model.title] !== 'undefined') {
			sm.alsoBehavesLike(this[model.title], model);
			return;
		}
		var typeConcept = this.hasMemberType;
		if (typeof typeConcept === 'undefined' || typeof typeConcept.getType === 'undefined') {
			throw new Error('The specified concept does not have a valid \'hasMemberType\' relationship with another concept');
		}
		var hasMemberType = sm[this._value][typeConcept._value];
		if (typeof hasMemberType === 'undefined') {
			throw new Error('The specified type does not exist in the core object model: ' + typeConcept._value);
		}
		if (typeof model.getType !== 'function') {
			throw new Error('The specified model is missing the getType function: ' + model.title);
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
				this.hasMember[model.title] = model;
				this[model.title] = model; // syntax sugar; like all Terms provide
				validModelType = true;
				break;
			}
		}
		if (!validModelType) {
			throw new Error('Did not find an allowed model type for: ' + modelType);
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
}(smallmachine));

