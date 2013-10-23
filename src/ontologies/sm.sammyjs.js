;(function(sm, sammy) {
	var ontology = new sm.Ontology('sm.sammyjs');

	ontology.addTerm('initialize');

	var Sammy = function(id, callback, runArg) {
		this._id = id;
		this._callback = callback;
		this._runArg = runArg || '#/';
		return this;
	};

	Sammy.prototype._name = 'Sammy';

	sm.type.extendedBy(Sammy);
	
	var sammyInitializerDelegate = {
		update : function(message) {
			if (sm.typeMask(message, { _id : true, _callback : true, _runArg : true }) === null) {
				return function(message) {
					sammy('#' + message._id, message._callback).run(message._runArg);
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
