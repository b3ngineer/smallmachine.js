;(function(sm, raphael) {
	var TITLE = 'sm.raphaeljs';
	var ontology = new sm.Ontology(TITLE);
	ontology.addTerm('set');

	var activator = function(model) {
		var percentagePattern = /^(\d+)%?$/;

		var svgHelper = function(elementId, width, height, asyncResult) {
			var element = document.getElementById(elementId+'');
			if (typeof element === 'undefined' || !element) {
				throw new Error('The specified element ID could not be found: ' + elementId);
			}

			var w=window,
				d=document,
				e=d.documentElement,
				g=d.getElementsByTagName('body')[0],
				x=w.innerWidth||e.clientWidth||g.clientWidth,
				y=w.innerHeight||e.clientHeight||g.clientHeight;

			var validWidth = width;
			if (width === null) {
				validWidth = element.offsetWidth || x;
			}
			var validWidthMatch = percentagePattern.exec(validWidth+'');
			if (!validWidthMatch) {
				throw new Error('The specified value for width is invalid (number, percentage or null allowed): ' + width);
			}

			if (typeof validWidth.indexOf === 'function' && validWidth.indexOf('%') > 0) {
				var elementWidth = element.offsetWidth || x;
				validWidth = elementWidth * 100 / parseFloat(validWidthMatch[0]);
			}

			var validHeight = height;
			if (height == null) {
				validHeight = element.offsetHeight || y;
			}
			var validHeightMatch = percentagePattern.exec(validHeight+'');
			if (!validHeightMatch) {
				throw new Error('The specified value for height is invalid (number, percentage or null allowed): ' + height);
			}

			if (typeof validHeight.indexOf === 'function' && validHeight.indexOf('%') > 0) {
				var elementHeight = element.offsetHeight || y;
				validHeight = elementHeight * parseFloat(validHeightMatch[0]) / 100;
			}

			var paper = raphael(elementId, validWidth, validHeight);
			return new sm.type.NamedValue(TITLE, 'paper', paper);
		};

		if (typeof model.set.addHelper === 'function') {
			model.set.addHelper('svg', svgHelper);
		}
	};

	ontology.registerActivator(activator, ['sm.channels']);

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		throw new Error('Could not extend the smallmachine.ontology property with the \'sm.raphaeljs\' ontology: ' + error.message + '\n' + error.stack);
	}
}(smallmachine, Raphael));
