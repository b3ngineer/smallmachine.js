;(function(sm, sammy) {
	var ontology = new sm.Ontology('sm.sammyjs');

	var Sammy = function(id, callback) {
		this._id = id;
		this._callback = callback;
		return this;
	};

	sm.type.extendedBy(Sammy, 'Sammy');

	var activator = function(model) {
	};

	ontology.registerActivator(activator);

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		throw new Error('Could not extend the smallmachine.ontology property with the \'sm.sammyjs\' ontology: ' + error.message + '\n' + error.stack);
	}
}(smallmachine, Sammy));
