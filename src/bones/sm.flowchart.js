;(function(sm, d3) {
	'use strict';

	sm.system.initialize.subscribe({
		update : function(message) {
			console.log(message);
			var svg = d3.select('body')
				.style('margin', '0px')
				.style('padding', '0px')
				.append('svg:svg')
				.attr('width', '100%')
				.attr('height', '100%');

			svg.selectAll('rect')
				.data(message.data)
				.enter()
					.append('rect')
					.attr('width', function(d){ return d.w; })
					.attr('height', function(d){ return d.h; })
					.attr('y',function(d){ return d.y; })
					.attr('x',function(d){ return d.x; })
					.attr('fill','blue');
		},
		cancel : function(message) {
			alert(message.status);
		}
	});

	/*
	d3.json('example.json', function(data) {

		var svg = d3.select('body')
			.style('margin', '0px')
			.style('padding', '0px')
			.append('svg:svg')
			.attr('width', '100%')
			.attr('height', '100%');

		svg.selectAll('rect')
			.data(data)
			.enter()
				.append('rect')
				.attr('width', function(d){ return d.w; })
				.attr('height', function(d){ return d.h; })
				.attr('y',function(d){ return d.y; })
				.attr('x',function(d){ return d.x; })
				.attr('fill','blue');
	});
	*/

	return true;
}(sm, d3));
