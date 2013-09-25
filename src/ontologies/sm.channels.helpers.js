;(function(sm) {

	var activator = function(model) {

		var jsonHelper = function(url, asyncResult){
			if (typeof jQuery !== 'undefined') {
				try {
					jQuery.ajax({
						dataType: 'json',
						url: url,
						type : 'GET',
						success: function(data, textStatus, jqxhr) {
							model.messenger.success.publish(textStatus);
							asyncResult.publish(data);
						},
						error: function(jqxhr, textStatus, thrown) {
							model.messenger.error.publish(thrown);
						}
					});
				}
				catch (error) {
					model.messenger.error.publish(error);
				}
			}
			else {
				var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP.3.0');
				xhr.onprogress = function() {};
				xhr.onerror = {};
				xhr.onreadystatechange = function() {
					if (xhr.readyState < 4) return;
					if (xhr.status == 200) {
						model.messenger.success.publish(xhr.statusText);
						asyncResult.publish(JSON.parse(xhr.responseText));
					}
					else {
						model.messenger.error.publish(xhr.statusText);
					}
				}
				xhr.open("GET", url, true);
				xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				xhr.setRequestHeader("Content-type", "application/json");
				xhr.send(null);
			}
			return asyncResult;
		};

		if (typeof model.initialize !== 'undefined' && typeof model.initialize.addHelper !== 'undefined') {
			model.initialize.addHelper('json', jsonHelper);
		}

		sm.addMessageType('Hook', function(targetObject, contextObject) {
			this.target = targetObject;
			this.context = contextObject;
			return this;
		});

		var hookHelper = function(targetObject, contextObject, asyncResult) {
			var hookObject = new sm.types.Hook(targetObject, contextObject);
			return hookObject;
		};

		if (typeof model.insert !== 'undefined' && typeof model.insert.addHelper !== 'undefined') {
			model.insert.addHelper('hook', hookHelper);
		}
	};

	sm.registerHelpers(activator);
}(smallmachine));
