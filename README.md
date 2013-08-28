# smallmachine.js #
----------

## What is it? ##
In a sentence, smallmachine.js is a 
"*semantic event strategy*".  It can be used standalone to wire components into an application layer&mdash;or it can be used to enhance (or replace) the event model in an existing framework or toolkit.

## The problem domain ##
Frameworks and toolkits often implement an observer pattern of some type that notifies event handlers (listeners) when an event is triggered.  Event models are typically lists of wide-open strings, global constants, or (arguably better) properties on a particular object.  Knowledge of the event model is a requirement of components and plugins that are bound to the application layer.  One problem is that coupling can become strong when event models are text-based, or when event models are extended to use application specific events.  Another problem with an event "list" occurs when events need to be sequenced or prioritized so that components can respond correctly.

## An event ontology, complete with inference  ##
Just as an ontology helps organize relationships between related *things* in a semantic data model, *events* can be organized in a fashion that describes their purpose with widespread clarity.  Smallmachine.js events are organized as terms that can be either concepts or relationships (nodes and edges in a graph).  The event model is extended via **rules** rather than strings&mdash;the usage of which **infers additional relationships between events**.  Event emissions propagate along intuitive paths through the ontology&mdash;letting component and plugin authors remain (generally) naive of externally defined custom events... even while handling externally defined events fitted correctly into the smallmachine.js ontology.

## It's not panacea for event driven architecture challenges... ##
...but smallmachine.js does offer alternatives to antipatterns that are commonplace when authors are left with little choice in the matter.



