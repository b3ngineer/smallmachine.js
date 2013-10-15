;(function(sm, sammy) {
	var ontology = new sm.Ontology('sm.sammyjs');

	ontology.addTerm('initialize');

	var Sammy = function(id, callback) {
		this._id = id;
		this._callback = callback;
		return this;
	};

	Sammy.prototype.getType = function() {
		return '[object Sammy]';
	};

	Sammy.prototype.ofType = function(type) {
		return type === 'Sammy' || (typeof type.getType === 'function' && type.getType() === this.getType());
	};

	sm.type.extendedBy(Sammy, 'Sammy');
	
	var sammyInitializerDelegate = {
		update : function(message) {
			if (typeof message.ofType === 'function' && message.ofType('Sammy')) {
				return function(message) {
					sammy('#' + message._id, message._callback).run('#/');
				};
			}
			return false;
		}
	};

	var activator = function(model) {
		model.initialize.subscribe({
			update : function(message) { return sammyInitializerDelegate; }
		});
	};

	ontology.registerActivator(activator, ['sm.channels']);

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		throw new Error('Could not extend the smallmachine.ontology property with the \'sm.sammyjs\' ontology: ' + error.message + '\n' + error.stack);
	}
}(smallmachine, Sammy));
