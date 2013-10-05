;(function(sm) {
	var ontology = new sm.Ontology('sm.sammyjs');

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		throw new Error('Could not extend the smallmachine.ontology property with the \'sm.sammyjs\' ontology: ' + error.message + '\n' + error.stack);
	}
}(smallmachine));
