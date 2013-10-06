;(function(sm, raphael) {
	var TITLE = 'sm.raphaeljs';
	var ontology = new sm.Ontology(TITLE);
	ontology.addTerm('set');

	var activator = function(model) {
		var percentagePattern = /^\d+/;

		var svgHelper = function(elementId, width, height, asyncResult) {
			var element = document.getElementById(elementId);
			if (typeof element === 'undefined' || !element) {
				throw new Error('The specified element ID could not be found: ' + elementId);
			}
			var w=window,
				d=document,
				e=d.documentElement,
				g=d.getElementsByTagName('body')[0],
				x=w.innerWidth||e.clientWidth||g.clientWidth,
				y=w.innerHeight||e.clientHeight||g.clientHeight;
			
			if (width == null) {
				var elementWidth = element.offsetWidth || x;
			}
			else if (typeof width.indexOf === 'function' && width.indexOf('%') > 0) {
				var match = percentagePattern.exec(width);
				if (!match) {
					throw new Error('Invalid width percentage value specified for \'sm.raphaeljs\' helper \'svg\': ' + width);
				}
				var elementWidth = element.offsetWidth || x;
				width = elementWidth * 100 / parseFloat(match);
			}

			if (height == null) {
				var elementHeight = element.offsetHeight || y;
			}
			else if (typeof height.indexOf === 'function' && height.indexOf('%') > 0) {
				var match = percentagePattern.exec(height);
				if (!match) {
					throw new Error('Invalid height percentage value specified for \'sm.raphaeljs\' helper \'svg\': ' + height);
				}
				var elementHeight = element.offsetHeight || y;
				height = elementHeight * parseFloat(match) / 100;
			}

			return new sm.type.NamedValue(TITLE, 'paper', raphael(elementId, width, height));
		};

		if (typeof model.set.addHelper === 'function') {
			model.set.addHelper('svg', svgHelper);
		}
	};

	ontology.registerActivator(activator);

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		throw new Error('Could not extend the smallmachine.ontology property with the \'sm.raphaeljs\' ontology: ' + error.message + '\n' + error.stack);
	}
}(smallmachine, Raphael));
