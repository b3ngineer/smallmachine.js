;(function($, raphael) {
	var $background = $('#background');
	var $gears = $('#gears');
	var $repo = $('#repo');

	var getCenter = function() {
		var centerPosition = { x : 0, y : 0 };
		centerPosition.x = $background.width() / 2;
		centerPosition.y = $gears.position().top + ($gears.height() / 2);
		return centerPosition;
	};

	var positionRepoLink = function() {
		var minX = 180, minY = 160, marginX = 200;
		var centerPosition = getCenter();
		var offsetY = 100;
		var offsetX = $background.width() / 4;
		if (offsetX < minX) {
			offsetY += minX - offsetX;
			offsetX = minX;
		}
		if (offsetY > minY) {
			offsetY = minY;
		}
		if (centerPosition.x < marginX) {
			offsetX -= marginX - centerPosition.x;
		}
		$repo.css({ top: centerPosition.y - offsetY + 'px', left: centerPosition.x - offsetX + 'px' });
	};

	$( window ).resize(function() {
		positionRepoLink();
	});

	$repo.click(function(e) {
		window.location.assign("https://github.com/b3ngineer/smallmachine.js");
	});
	
	positionRepoLink();
}(jQuery, Raphael));
