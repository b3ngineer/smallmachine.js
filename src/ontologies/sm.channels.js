;(function(sm) {
	var ontology = new sm.Ontology('sm.channels');

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
	ontology.user.relatesTo(ontology.performs, ontology.action);
	ontology.system.isA(ontology.thing);
	ontology.system.relatesTo(ontology.performs, ontology.task);
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

		if (typeof model.initialize.addHelper === 'function') {
			model.initialize.addHelper('json', jsonHelper);
		}

		sm.type.extendedBy(function(targetObject, contextObject) {
			this.target = targetObject;
			this.context = contextObject;
			return this;
		}, 'Hook');

		var hookHelper = function(targetObject, contextObject, asyncResult) {
			var hookObject = new sm.type.Hook(targetObject, contextObject);
			return hookObject;
		};

		if (model.insert.addHelper === 'function') {
			model.insert.addHelper('hook', hookHelper);
		}
	};

	ontology.registerActivator(activator);

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		throw new Error('Could not extend the smallmachine.ontology property with the \'sm.channels\' ontology: ' + error.message + '\n' + error.stack);
	}
}(smallmachine));
