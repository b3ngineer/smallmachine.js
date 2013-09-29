;(function(sm) {
	var o = new sm.Ontology('sm.properies');
	o.addTerm('property');
	o.addTerm('ontology');
	o.addTerm('messageType');
	o.addTerm('behavior');
	o.ontology.isA(o.property);
	o.messageType.isA(o.property);
	o.behavior.isA(o.property);

	var activator = function(model) {
	};

	sm.registerHelpers(activator);

	var TypeExtender = function() {
		return this;
	};

	TypeExtender.prototype.extend = function(Type, model) {
	};
	
	sm.alsoBehavesLike(sm, o.getModel());
}(smallmachine));

