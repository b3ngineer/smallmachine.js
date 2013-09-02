# smallmachine.js #

## What is it? ##
In a sentence, *smallmachine.js* is a 
"*semantic messaging strategy*".  It can be used standalone to wire components into an application layer&mdash;or it can be used to enhance the event model in an existing framework or toolkit.

```js
(function(sm){
	// myHandler wants to be updated with all user click messages
	sm.user.click.subscribe(myHandler);

	// myFirstMessage is heard by myHandler
	sm.user.click.publish(myFirstMessage);

	// mySecondMessage is also heard by myHandler,
	// ...because user.click is an action
	sm.action.publish(mySecondMessage);
}(smallmachine));
```

### The problem domain ###
Event models are typically lists of strings, globally defined constants, or properties on a particular object.  Knowledge of the pinpointed events in the model is a requirement of components and plugins that are bound to the application layer.  One problem with such a model is that coupling can become strong when event models are text-based, or when event models are extended to use component specific events.  An inherent complication with an event "list" model occurs when events need to be sequenced or prioritized so that components can respond in order.

## What does it include? ##

### An ontology, complete with inference  ###
Just as an ontology helps organize relationships between related *things* in a semantic data model, *channels* can be organized in a fashion that describes their purpose with widespread clarity.  *Smallmachine.js* channels are organized as terms that can be either concepts or relationships (nodes and edges in a graph).  The *smallmachine.js* model is extended via **rules** rather than strings&mdash;the usage of which **infers additional relationships between channels**.  Event emissions propagate along intuitive paths through the ontology&mdash;letting component and plugin authors remain (generally) naive of externally defined custom channels... even while handling any externally defined channels fitted into the *smallmachine.js* ontology.

```js
(function(sm) {
	// demo of rules based model extension
	sm.add(new ontology.Term('thing'));
	sm.add(new ontology.Term('user'));
	sm.add(new ontology.Term('performs'));
	sm.add(new ontology.Term('action'));
	sm.user.isA(ontology.thing);
	sm.action.isA(ontology.thing);
	sm.performs.hasRange(ontology.action);
	sm.user.relatesTo(sm.performs, sm.action);
}(smallmachine));
```

### A succinct syntax ###
The hierarchy of the *smallmachine.js* model is integrated with an asynchronous publisher/subscriber pattern.  That is to say, every property in the object hierarchy is a semantically named channel that supports ```publish()``` and ```subscribe()``` methods.  All behaviors are derived from those two methods.  

```js
(function(sm) {
	// the core ontology defines 'user' as a Term

	// all Terms are channels
	sm.user.subscribe(...);
	sm.user.publish(...);

	// the core ontology defines 'action' as being performed by 'users'
	sm.user.performs.action.click.subscribe(...);
	sm.user.performs.action.click.publish(...);

	// the core ontology defines 'action' in the range of 'performs'
	// ... 'performs' is a relationship between 'users' and 'actions'
	// ... 'click' is a subclass of 'action'
	// ... therefore the syntax allows for user.click to be a valid channel
	sm.user.click.subscribe(...);
	sm.user.click.publish(...);
}(smallmachine));
```

Additionally, helpers are supplied as partially applied methods to ```publish()```, on specific channels&mdash;as a convenience for performing common tasks.

```js
(function(sm) {
	// publishes the data returned from the supplied URL
	// ... to the system.initialize channel
	sm.system.intialize.json('http://my.url.com/rest/api/data');
}(smallmachine));
```

### A notification lifecycle ###
Subscribers remain relatively anonymous to other subscribers, thereby making event prioritization a tricky business.  To avoid the need for subscribers to arrange themselves in sequence, *smallmachine.js* incorporates a notification lifecycle that allows for deferred and conditional application behaviors.  Subscribers determine if they have handled the incoming message authoritatively or not.  They can defer execution until all subscribers have received message updates, and they can even abstain from acting unless no other subscribers declared authority.

