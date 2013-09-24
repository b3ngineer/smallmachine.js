;(function(sm) {
	var ontology = new sm.Ontology('smallmachine.channels');

	// concepts
	ontology.addTerm('thing');
	ontology.addTerm('user');
	ontology.addTerm('system');
	ontology.addTerm('action');
	ontology.addTerm('click');
	ontology.addTerm('doubleClick');
	ontology.addTerm('keyPress');
	ontology.addTerm('task');
	ontology.addTerm('initialize');
	ontology.addTerm('insert');
	ontology.addTerm('remove');
	ontology.addTerm('get');
	ontology.addTerm('set');
	ontology.addTerm('messenger');
	ontology.addTerm('success');
	ontology.addTerm('error');

	// relationships
	ontology.addTerm('performs');
	ontology.addTerm('reactsTo');

	ontology.user.isA(ontology.thing);
	ontology.system.isA(ontology.thing);
	ontology.action.isA(ontology.thing);
	ontology.task.isA(ontology.thing);
	ontology.messenger.isA(ontology.thing);
	ontology.click.isA(ontology.action);
	ontology.doubleClick.isA(ontology.action);
	ontology.keyPress.isA(ontology.action);
	ontology.get.isA(ontology.task);
	ontology.set.isA(ontology.task);
	ontology.success.isA(ontology.messenger);
	ontology.error.isA(ontology.messenger);
	ontology.initialize.isA(ontology.task);
	ontology.insert.isA(ontology.task);
	ontology.remove.isA(ontology.task);
	ontology.performs.hasRange(ontology.action).hasRange(ontology.task);
	ontology.reactsTo.hasRange(ontology.action).hasDomain(ontology.system);
	ontology.user.relatesTo(ontology.performs, ontology.action);
	ontology.system.relatesTo(ontology.performs, ontology.task);

	var jsonHelper = function(url, asyncResult){
		if (typeof jQuery !== 'undefined') {
			try {
				jQuery.ajax({
					dataType: 'json',
					url: url,
					type : 'GET',
					success: function(data, textStatus, jqxhr) {
						ontology.messenger.success.publish(textStatus);
						asyncResult.publish(data);
					},
					error: function(jqxhr, textStatus, thrown) {
						ontology.messenger.error.publish(thrown);
					}
				});
			}
			catch (error) {
				ontology.messenger.error.publish(error);
			}
		}
		else {
			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP.3.0');
			xhr.onprogress = function() {};
			xhr.onerror = {};
			xhr.onreadystatechange = function() {
				if (xhr.readyState < 4) return;
				if (xhr.status == 200) {
					ontology.messenger.success.publish(xhr.statusText);
					asyncResult.publish(JSON.parse(xhr.responseText));
				}
				else {
					ontology.messenger.error.publish(xhr.statusText);
				}
			}
			xhr.open("GET", url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(null);
		}
		return asyncResult;
	}; 

	//ontology.system.initialize.addHelper('json', jsonHelper);

	sm.addMessageType('Hook', function(targetObject, contextObject) {
		this.target = targetObject;
		this.context = contextObject;
		return this;
	});

	var hookHelper = function(targetObject, contextObject, asyncResult) {
		var hookObject = new sm.types.Hook(targetObject, contextObject);
		return hookObject;
	};

	//ontology.system.insert.addHelper('hook', hookHelper);

	sm.addOntology(ontology);
}(smallmachine));
