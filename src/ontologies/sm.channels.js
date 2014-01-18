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

	function activator(model) {

		function jsonHelper(url, errorHandler, asyncResult){
			if (typeof jQuery !== 'undefined') {
				try {
					jQuery.ajax({
						dataType: 'json',
						url: url,
						type : 'GET',
						success: function(data, textStatus, jqxhr) {
							model.messenger.success.publish(textStatus);
							asyncResult.publish(new sm.type.NamedValue('sm.channels', url, data));
						},
						error: function(jqxhr, textStatus, thrown) {
							if (errorHandler) {
								errorHandler(jqxhr, textStatus, thrown);
							}
							else {
								sm.error(new Error(thrown));
							}
						}
					});
				}
				catch (error) {
					sm.error(new Error(error));
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
						asyncResult.publish(new sm.type.NamedValue('sm.channels', url, JSON.parse(xhr.responseText)));
					}
					else {
						sm.error(new Error(xhr.statusText));
					}
				}
				xhr.open("GET", url, true);
				xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				xhr.setRequestHeader("Content-type", "application/json");
				xhr.send(null);
			}
			return asyncResult;
		};

		var defaultStorageDelegate = {
			update : function(message) {
				if (typeof message.key !== 'undefined' && typeof message.namespace !== 'undefined') {
					return function(message) {
						model.memory.modify(message);
					}
				}
				return false;
			}
		};

		sm.alsoBehavesLike(model, { memory : new sm.type.NamedValueCollection() });
		model.set.subscribe({ update : function(message) { return defaultStorageDelegate; } });

		var defaultValueDelegate = {
			update : function(message) {
				if (typeof message.key !== 'undefined' && typeof message.namespace !== 'undefined') {
					return function(message) {
						model.memory.getValue(message);
					}
				}
				return false;
			}
		};

		model.get.subscribe({ update : function(message) { return defaultValueDelegate; } });

		if (typeof model.initialize.addHelper === 'function') {
			model.initialize.addHelper('json', jsonHelper, 2);
		}
		if (typeof model.set.addHelper === 'function') {
			model.set.addHelper('config', function(config) {
				return new sm.type.NamedValue('sm.channels', 'config', config);
			});
		}
		if (typeof model.get.addHelper === 'function') {
			model.get.addHelper('json', jsonHelper, 2);

			var Config = function() {
				this.namespace = 'sm.channels';
				this.key = 'config';
				return this;
			};

			Config.prototype._name = 'Config';

			Config.prototype.setValue = function(value) {
				sm.alsoBehavesLike(this, value);
			};

			sm.type.extendedBy(Config);

			model.get.addHelper('config', function(outVar) {
				return outVar;
			});
		}
	};

	ontology.registerActivator(activator);

	try {
		sm.ontology.extendedBy(ontology);
	}
	catch (error) {
		sm.error(new Error('Could not extend the smallmachine.ontology property with the \'sm.channels\' ontology: ' + error.message + '\n' + error.stack));
	}
}(smallmachine));
